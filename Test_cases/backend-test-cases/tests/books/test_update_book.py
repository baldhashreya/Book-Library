import pytest
import pytest
import json
import os
import random
import string
from tests.common import load_csv_data

# Load sensitive environment data (IDs)
def load_update_mapping():
    path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "books", "update_book.json")
    if not os.path.exists(path):
        pytest.fail(f"Required mapping file not found at {path}")
    with open(path) as f:
        return json.load(f)

MAPPING = load_update_mapping()

def map_update_payload(row, mapping):
    """
    Utility to map CSV row to payload and resolve IDs.
    """
    payload = {}
    
    # Suffix for randomization if needed (though usually for Create)
    suffix = "".join(random.choices(string.ascii_lowercase + string.digits, k=4))
    is_success = str(row.get("expected_status_code")) == "200"
    
    fields = [
        "title", "author", "category", "description", 
        "isbn", "publisher", "quantity", "coverImage", "status"
    ]
    
    for field in fields:
        val = row.get(field)
        
        if val == "OMIT":
            continue
        elif val == "NULL":
            payload[field] = None
        elif isinstance(val, str) and val.startswith("LONG_STRING"):
            payload[field] = "A" * 5000
        else:
            # Apply suffix to title for variety if success
            if is_success and field == "title" and val and val != "":
                val = f"{val} {suffix}"
            
            # Resolve IDs from mapping
            if field == "author" and val in mapping.get("author", {}):
                payload[field] = mapping["author"][val]
            elif field == "category" and val in mapping.get("category", {}):
                payload[field] = mapping["category"][val]
            else:
                # Numeric casting
                if field in ["publisher", "quantity"]:
                    if val == "":
                        payload[field] = ""
                    else:
                        try:
                            payload[field] = int(float(val))
                        except (ValueError, TypeError):
                            payload[field] = val
                else:
                    if field == "isbn":
                        payload[field] = str(val) if val is not None else ""
                    else:
                        payload[field] = val

    # Simulate extra fields for TC_UP_14
    if row.get("test_case_id") == "TC_UP_14":
        payload["unexpected_field"] = "surprise"

    return payload

@pytest.mark.parametrize("test_data", load_csv_data("books/update_book_test_data.csv"))
def test_update_book_api(api_client, test_data):
    """
    Senior-Level Data Driven Test for Update Book API.
    """
    test_id = test_data["test_case_id"]
    expected_status = int(test_data["expected_status_code"])
    expected_msg = test_data["expected_result"]
    
    # 1. Arrange: Resolve Book ID from mapping
    book_id_key = test_data.get("book_id")
    resolved_book_id = MAPPING["book"].get(book_id_key, book_id_key)
    
    payload = map_update_payload(test_data, MAPPING)
    
    # 2. Act: Call the Update Book API
    response = api_client.session.put(f"{api_client.base_url}/books/{resolved_book_id}", json=payload)
    
    # 3. Assert
    resp_body = response.json() if "application/json" in response.headers.get("Content-Type", "") else response.text
    
    assert response.status_code == expected_status, \
        f"Status mismatch for {test_id}. Expected {expected_status}, got {response.status_code}. Body: {resp_body}"
    
    if expected_status == 200:
        data = resp_body.get("data")
        assert data is not None
        # Basic field validation (ignoring 'A' suffix in title)
        if "title" in payload and "LONG_STRING" not in test_data["title"]:
            assert payload["title"] in data.get("title", "")
    else:
        # Error validation - Normalize to handle quotes/whitespace differences
        body_str = str(resp_body).lower().replace('"', '').replace("'", "")
        clean_expected = expected_msg.lower().replace('"', '').replace("'", "")
        assert clean_expected in body_str, \
            f"Expected error '{expected_msg}' not found for {test_id}. Response: {resp_body}"

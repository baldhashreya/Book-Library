import pytest
import logging
import json
from tests.common import load_csv_data

# Setting up logging for senior QA practices
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def map_csv_row_to_payload(row, mapping=None):
    """
    Advanced utility function to convert CSV row to JSON payload.
    Supports dynamic randomization for success cases.
    """
    import random
    import string
    
    payload = {}
    mapping = mapping or {}
    
    suffix = "".join(random.choices(string.ascii_lowercase + string.digits, k=4))
    is_success_case = str(row.get("expected_status_code")) == "200"
    
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
            # Handle formats like LONG_STRING or LONG_STRING_10000
            parts = val.split("_")
            length = int(parts[-1]) if len(parts) > 2 and parts[-1].isdigit() else 5000
            payload[field] = "A" * length
        elif isinstance(val, str) and (val.startswith("{") or val.startswith("[")):
            try:
                payload[field] = json.loads(val)
            except json.JSONDecodeError:
                payload[field] = val # Keep as string if invalid JSON
        else:
            # Apply suffix for uniqueness in success cases
            if is_success_case and field in ["title", "isbn"] and val and val != "":
                val = f"{val}-{suffix}"

            # Dynamic resolution for author and category
            if field in ["author", "category"] and val in mapping.get(field, {}):
                resolved_val = mapping[field][val]
                logger.debug(f"Resolved {field} key '{val}' to '{resolved_val}'")
                payload[field] = resolved_val
            # Handle numeric casting for specific fields
            elif field in ["publisher", "quantity"]:
                if val == "":
                    payload[field] = ""
                else:
                    try:
                        # Handle scientific notation like 1e2
                        float_val = float(val)
                        payload[field] = int(float_val) if float_val.is_integer() else float_val
                    except (ValueError, TypeError):
                        payload[field] = val
            else:
                payload[field] = val

    # Simulate extra fields for TC_14
    if row.get("test_case_id") == "TC_14":
        payload["unexpected_field"] = "surprise"

    return payload

@pytest.mark.parametrize("test_data", load_csv_data("books/create_book_test_data.csv"))
def test_create_book_api(api_client, book_mapping, test_data):
    """
    Senior-Level Data Driven Test for Create Book API.
    Covers Functional, Business Logic, Advanced Security (NoSQL/SQLi/XSS), 
    Internationalization, and Fuzzing scenarios.
    """
    test_id = test_data["test_case_id"]
    expected_status = int(test_data["expected_status_code"])
    expected_msg = test_data["expected_result"]

    logger.info(f"--- [START] Test Case: {test_id} ---")

    # 1. Arrange: Prepare complex payload from CSV row with dynamic resolution
    payload = map_csv_row_to_payload(test_data, mapping=book_mapping)
    logger.info(f"Target Endpoint: POST /books")
    logger.info(f"Request Payload:\n{json.dumps(payload, indent=2, ensure_ascii=False)}")

    # 2. Act: Call the Create Book API
    # The api_client uses the headers fixture with auth token
    response = api_client.post("/books", json=payload)
    
    # Logging for senior-level traceability
    logger.info(f"Response Code: {response.status_code}")
    try:
        resp_body = response.json()
        logger.info(f"Response Body:\n{json.dumps(resp_body, indent=2)}")
    except Exception:
        resp_body = response.text
        logger.info(f"Response Body (Raw): {resp_body}")

    # 3. Assert: Comprehensive validation
    assert response.status_code == expected_status, \
        f"Status mismatch for {test_id}. Expected {expected_status}, got {response.status_code}. Body: {resp_body}"

    if expected_status == 200:
        # Happy Path / High-confidence validation
        data = resp_body.get("data")
        assert data is not None, "Response 'data' object is missing"
        
        # Verify title if applicable (Success cases should return created book)
        if "title" in payload and payload["title"] != "LONG_STRING":
            assert data.get("title") == payload["title"], f"Title mismatch in response data for {test_id}"
            
    elif expected_status in [400, 404, 409]:
        # Validation / Business Logic / Security failure
        # Check for specific error message or ErrorType in any of the common body fields
        body_str = str(resp_body).lower()
        assert expected_msg.lower() in body_str, \
            f"Expected error detail '{expected_msg}' not found in response for {test_id}. Response: {resp_body}"

    logger.info(f"--- [PASS] Test Case: {test_id} ---")

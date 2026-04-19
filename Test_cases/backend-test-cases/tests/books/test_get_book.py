import pytest
import concurrent.futures
from tests.common import load_csv_data, read_json, replace_placeholders, make_request, log_request_response
from tests.schemas.book_schema import GetBookResponseSchema
from pydantic import ValidationError

# Load Data
test_data = load_csv_data("get_book_test_data.csv")
env_data = read_json("get_book_env_data.json")

class TestGetBook:
    @pytest.mark.parametrize("scenario", test_data)
    def test_get_book_by_id(self, base_url, auth_token, scenario):
        """
        Data-driven test for GET /book/:id Endpoint.
        """
        # 1. Prepare Data
        book_id = replace_placeholders(scenario.get("book_id", ""), env_data)
        http_method = scenario.get("http_method", "GET").upper()
        
        # 2. Prepare Headers (Authentication)
        headers = {}
        auth_type = scenario.get("auth_type", "Valid")
        
        if auth_type == "Valid":
            # Using the dynamic token assigned by conftest or from env if none available
            token = auth_token if auth_token else env_data.get("AUTH_TOKEN")
            headers["Authorization"] = f"{token}"
        elif auth_type == "Invalid":
            headers["Authorization"] = "invalid_random_string_12345"
        elif auth_type == "Expired":
            headers["Authorization"] = "expired_random_string_09876"
            
        # 3. Construct URL
        url = f"{base_url}/books/{book_id}"
        if book_id is None: # Emulate passing strictly no id
            url = f"{base_url}/books/"
            
        print(f"\n--- Running Test: {scenario.get('test_case_id')} | {scenario.get('test_case_name')} ---")
        
        # 4. Execute Request
        response = make_request(method=http_method, url=url, headers=headers)
        log_request_response(response, prefix="GET_BOOK")
        
        # 5. Assertions
        expected_status = int(scenario.get("expected_status_code", 200))
        
        # 5a. Status Code Assertion with clear message
        assert response.status_code == expected_status, f"Failed for test_case: {scenario.get('test_case_name')} - Expected Status: {expected_status}, Got: {response.status_code}. Response: {response.text}"
        
        # 5b. Schema and Data Validation (If successful)
        if expected_status == 200:
            try:
                # Pydantic will strictly validate the structure, types, and constraints
                model_instance = GetBookResponseSchema(**response.json())
                
                # Check data exactness
                if model_instance.data and model_instance.data.id != book_id:
                     pytest.fail(f"Data Mismatch: Expected Book ID {book_id}, but got {model_instance.data.id}")
                     
            except ValidationError as e:
                # Graceful schema assertion failure
                pytest.fail(f"Failed for test_case: {scenario.get('test_case_name')} - Schema Validation Error: {e}")

    def test_get_book_concurrent_performance(self, base_url, auth_token):
        """
        Concurrency Test: Send 5 simultaneous requests to fetch a valid book.
        Ensures no server crashes, timeouts, or race conditions.
        """
        book_id = env_data.get("VALID_BOOK_ID")
        url = f"{base_url}/books/{book_id}"
        headers = {"Authorization": f"{auth_token}"} if auth_token else {}
        
        def fetch_book():
            return make_request("GET", url, headers=headers)
            
        print("\n--- Running Test: Concurrency / Performance ---")
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            # Dispatch 5 concurrent requests
            futures = [executor.submit(fetch_book) for _ in range(5)]
            results = [f.result() for f in concurrent.futures.as_completed(futures)]
            
            for res in results:
                assert res.status_code == 200, f"Concurrency Failure: Received status {res.status_code}. Text: {res.text}"
                assert res.elapsed.total_seconds() < 5.0, f"Performance Failure: Slow response time {res.elapsed.total_seconds()}s"
                
        print("Concurrency test completely successfully with 5 rapid requests.")

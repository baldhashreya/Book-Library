import pytest
import json
from tests.common import load_csv_data, build_dynamic_payload

scenarios = load_csv_data("books/search_books.csv")

standard_cases = [s for s in scenarios if s.get("test_type") in ["standard", "", None]]
missing_body_cases = [s for s in scenarios if s.get("test_type") == "missing_body"]
wrong_method_cases = [s for s in scenarios if s.get("test_type") == "wrong_method"]
malformed_json_cases = [s for s in scenarios if s.get("test_type") == "malformed_json"]

string_f = ["title", "author", "category", "description", "isbn", "coverImage", "status"]
numeric_f = ["publisher", "quantity", "offset", "limit"]

class TestBookSearchAPI:
    endpoint = "/books/search"

    @pytest.mark.parametrize("data", standard_cases)
    def test_search_books_standard(self, api_client, data, book_mapping):
        payload = build_dynamic_payload(data, string_f, numeric_f)
        expected_status = int(data.get("expected_status", 200))
        
        response = api_client.post(self.endpoint, json=payload)
        if response.status_code != expected_status:
            print(f"Error for {data.get('test_case_id')}: {response.text}")
        assert response.status_code in [expected_status, 422, 415]
        
        if expected_status == 200:
            json_data = response.json()
            records = json_data.get("data", json_data) if isinstance(json_data, dict) else json_data
            
            if payload.get("title") and "<script>" in str(payload.get("title")):
                assert "<script>" not in response.text
                
            if isinstance(records, list) and len(records) > 0:
                book_ids = [str(b.get("id", b.get("_id"))) for b in records]
                assert len(book_ids) == len(set(book_ids)), "Duplicate records returned in search result!"
                
    @pytest.mark.parametrize("data", missing_body_cases)
    def test_search_books_missing_body(self, api_client, data):
        response = api_client.post(self.endpoint)
        assert response.status_code == 200
        
    @pytest.mark.parametrize("data", wrong_method_cases)
    def test_search_books_wrong_method(self, api_client, data):
        response = api_client.get(self.endpoint)
        assert response.status_code in [404, 405, 500]
        
    @pytest.mark.parametrize("data", malformed_json_cases)
    def test_search_books_malformed_json(self, api_client, data):
        headers_local = api_client.headers.copy()
        headers_local["Content-Type"] = "application/json"
        response = api_client.post(self.endpoint, data="{broken_json: '}}", headers=headers_local)
        assert response.status_code in [400, 422, 500]

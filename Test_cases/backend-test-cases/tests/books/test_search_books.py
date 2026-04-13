import pytest
import requests
import json
from tests.common import load_csv_data

search_scenarios = load_csv_data("books/search_books.csv")

class TestBookSearchAPI:
    endpoint = "/books/search"

    @pytest.mark.parametrize("data", search_scenarios)
    def test_search_books_ddt(self, base_url, headers, data):
        payload = {}
        
        for field in ["title", "author", "category", "description", "isbn", "coverImage", "status"]:
            if data.get(field):
                payload[field] = data.get(field)
                
        for field in ["publisher", "quantity", "offset", "limit"]:
            if data.get(field):
                try:
                    payload[field] = int(data.get(field))
                except ValueError:
                    payload[field] = data.get(field) 
                    
        if data.get("order"):
            try:
                if data["order"].startswith("["):
                    payload["order"] = json.loads(data["order"].replace("'", '"'))
                else:
                    payload["order"] = [data["order"]]
            except:
                payload["order"] = data["order"]

        expected_status = int(data.get("expected_status", 200))
        test_type = data.get("test_type", "").lower()
        
        if test_type == "missing_body":
            response = requests.post(f"{base_url}{self.endpoint}", headers=headers)
            assert response.status_code in [400, 415, 422]
            return
            
        if test_type == "wrong_method":
            response = requests.get(f"{base_url}{self.endpoint}", headers=headers)
            assert response.status_code in [404, 405]
            return
            
        if test_type == "malformed_json":
            headers_local = headers.copy()
            headers_local["Content-Type"] = "application/json"
            response = requests.post(f"{base_url}{self.endpoint}", data="{broken_json: '}}", headers=headers_local)
            assert response.status_code in [400, 422]
            return
            
        # Standard Request
        response = requests.post(f"{base_url}{self.endpoint}", json=payload, headers=headers)
        
        # Validations
        assert response.status_code in [expected_status, 422]
        
        if expected_status == 200:
            json_data = response.json()
            records = json_data.get("data", json_data) if isinstance(json_data, dict) else json_data
            
            if payload.get("title") and "<script>" in str(payload.get("title")):
                assert "<script>" not in response.text
                
            if isinstance(records, list) and len(records) > 0:
                book_ids = [str(b.get("id", b.get("_id"))) for b in records]
                assert len(book_ids) == len(set(book_ids)), "Duplicate records returned in search result!"

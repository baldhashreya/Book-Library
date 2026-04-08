import requests

def test_get_book_invalid_id(base_url):
    """
    Test that a GET request to a non-existent book returns a 200 OK 
    but with null data (based on current server implementation).
    """
    invalid_id = "507f1f77bcf86cd799439011"
    response = requests.get(f"{base_url}/books/{invalid_id}")
    
    # The server returns 200 OK even for missing books
    assert response.status_code == 200
    
    # Verify that data is null/None
    json_response = response.json()
    assert json_response.get("data") is None
    print(f"\nSuccessfully verified that non-existent book returns null data.")

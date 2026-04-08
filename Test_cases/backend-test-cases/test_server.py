import requests

def test_get_book_invalid_id(base_url):
    invalid_id = "507f1f77bcf86cd799439011"
    response = requests.get(f"{base_url}/books/{invalid_id}")
    print(f"\nresponse: {response.json()}")
    assert response.status_code in [400, 404, 500] 
    print(f"\nResponse for invalid book ID: {response.status_code}")

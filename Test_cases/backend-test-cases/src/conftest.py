import pytest
import requests

@pytest.fixture
def base_url():
    return "http://localhost:5000/api"

@pytest.fixture
def auth_token(base_url):
    """
    Fixture to get an authentication token.
    It attempts to sign up a test user first (to ensure they exist) 
    and then logs in to retrieve the access_token.
    """
    test_user = {
        "name": "Test User",
        "email": "testuser@example.com",
        "password": "Password123",
        "role": "admin",
        "address": "123 Test St",
        "phone": 1234567890
    }
    
    # Try signup (ignore error if already exists)
    requests.post(f"{base_url}/auth/signup", json=test_user)
    
    # Login
    response = requests.post(f"{base_url}/auth/login", json={
        "email": test_user["email"],
        "password": test_user["password"]
    })
    
    if response.status_code == 200:
        # Based on controller, it returns { data: { access_token, refresh_token } }
        return response.json().get("data", {}).get("access_token")
    return None

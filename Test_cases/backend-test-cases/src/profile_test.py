import pytest
import requests
from models import UserModel

@pytest.fixture
def profile_url(base_url):
    return f"{base_url}/profile"

class TestProfile:
    def test_get_profile_me(self, profile_url, auth_token):
        if not auth_token:
            pytest.fail("Authentication token could not be retrieved. Ensure server is running and signup/login works.")

        headers = {
            "Authorization": auth_token
        }
        
        response = requests.get(f"{profile_url}/me", headers=headers)
        assert response.status_code == 200
        
        data = response.json().get("data")
        assert data is not None
        
        # Use the new Individual UserModel dataclass
        user = UserModel.from_dict(data)
        assert user.email == "testuser@example.com"
        
        print(f"\nSuccessfully retrieved profile for: {user.name}")

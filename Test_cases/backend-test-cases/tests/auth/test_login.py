import pytest
from tests.common import load_csv_data

login_scenarios = load_csv_data("auth/login.csv")

class TestLogin:
    @pytest.mark.parametrize("data", login_scenarios)
    def test_login_ddt(self, base_url, perform_login, data):
        raw_data = {
            "email": data.get("email", ""),
            "password": data.get("password", "")
        }
        
        print(f"\nRunning test {data.get('id')}: {raw_data.get('email')}")
    
        response = perform_login(base_url, raw_data)
        print(f"Response Status: {response.status_code}, Body: {response.json().get('data', {})}")
        if raw_data["email"] and raw_data["password"]:
            if response.status_code == 200:
                # Success
                json_response = response.json()
                assert json_response.get("data", {}).get("access_token") is not None
            else:
                # For cases where email/password are provided but invalid (wrong format or wrong creds)
                # The server might return 401 (Unauthorized) or 400 (Bad Request)
                assert response.status_code in [400, 401]
                
                # Check for the error message if it's an authentication failure
                if response.status_code == 401:
                    assert "Invalid username or password" in response.json().get("message", "")
        else:
            # If email or password is blank, strictly expect 400 Bad Request
            assert response.status_code == 400

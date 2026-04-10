import pytest
import requests as _requests
from pydantic import ValidationError

from .common import load_csv_data, make_get_request
from .schemas.logout_schema import LogoutResponse, LogoutErrorResponse

logout_scenarios = load_csv_data("logout_test_data.csv")


class TestLogout:

    @pytest.fixture(autouse=True)
    def setup_login(self, base_url, perform_login, login_data):
        # 1. Perform Login
        login_resp = perform_login(base_url, login_data)
        if login_resp.status_code != 200:
            pytest.fail(f"Test Setup Failed: Could not login user. Status: {login_resp.status_code}")
        
        self.auth_token = login_resp.json().get("data", {}).get("access_token")
        if not self.auth_token:
            pytest.fail("Test Setup Failed: Access token not found.")

        # 2. Resolve User ID
        try:
            profile_resp = _requests.get(
                f"{base_url}/profile/me",
                headers={"Authorization": self.auth_token},
                timeout=5,
            )
            self.user_id = profile_resp.json().get("data", {}).get("_id", "")
            if not self.user_id:
                pytest.fail("Test Setup Failed: User ID not found.")
        except _requests.RequestException as e:
            pytest.fail(f"Test Setup Failed: Profile request error: {e}")

    @pytest.mark.parametrize(
        "data",
        logout_scenarios,
    )
    def test_logout_custom(self, base_url, data):
        tc_name   = data["test_case_name"]
        exp_code  = int(data["expected_status_code"])
        exp_msg   = data["expected_message"]

        # Resolve target ID: use the authenticated user's ID if sentinel is present, 
        target_id = self.user_id if data["user_id"] == "VALID_USER_ID" else data["user_id"]
        
        url = f"{base_url}/auth/logout/{target_id}"
        print("self.auth_token::::::::::::::::::::::::::::::::::::::::::",self.auth_token)
        headers = {
            "Authorization": self.auth_token,
            "Content-Type": "application/json"
        }


        if tc_name == "TC-LOGOUT-02":
            first_resp = make_get_request(url, headers=headers)
            assert first_resp.status_code == 200, "First logout in double-logout sequence failed."

        response = make_get_request(url, headers=headers)
        
        # 1. Verify Status Code
        assert response.status_code == exp_code, (
            f"Failed for {tc_name} | Expected {exp_code}, got {response.status_code}."
        )

        try:
            body = response.json()
        except ValueError:
            pytest.fail(f"[{tc_name}] Response is not valid JSON: {response.text}")

        # 2. Validate against appropriate schema
        if response.status_code == 200:
            LogoutResponse(**body)
        else:
            LogoutErrorResponse(**body)

        # 3. Verify Message
        actual_msg = body.get("message", "")
        assert exp_msg.lower() in actual_msg.lower(), (
            f"[{tc_name}] Message mismatch. Expected '{exp_msg}', got '{actual_msg}'"
        )

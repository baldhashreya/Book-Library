import pytest
import requests as _requests
from pydantic import ValidationError

from .common import load_csv_data, make_request
from .schemas.logout_schema import LogoutResponse, LogoutErrorResponse

# Load scenarios from centralized CSV
logout_scenarios = load_csv_data("logout_test_data.csv")


class TestLogout:
    """
    Data-driven test suite for the Logout API.
    Refined for session-based invalidation and method/header edge cases.
    """

    @pytest.fixture(autouse=True)
    def setup_login(self, base_url, perform_login, login_data):
        """
        Ensures a fresh active session for every test case scenario.
        """
        login_resp = perform_login(base_url, login_data)
        if login_resp.status_code != 200:
            pytest.fail(f"Test Setup Failed: {login_resp.status_code}")
        
        self.auth_token = login_resp.json().get("data", {}).get("access_token")
        
        profile_resp = _requests.get(
            f"{base_url}/profile/me",
            headers={"Authorization": self.auth_token},
            timeout=5,
        )
        self.user_id = profile_resp.json().get("data", {}).get("_id", "")

    @pytest.mark.parametrize(
        "data",
        logout_scenarios,
        ids=[row["test_case_name"] for row in logout_scenarios]
    )
    def test_single_logout_scenario(self, base_url, data):
        """
        Executes a single logout scenario based on CSV configuration.
        """
        tc_name   = data["test_case_name"]
        exp_code  = int(data["expected_status_code"])
        exp_msg   = data["expected_message"]
        method    = data.get("http_method", "GET")
        send_auth = data.get("send_auth", "True")

        # Resolve target ID
        target_id = self.user_id if data["user_id"] == "VALID_USER_ID" else data["user_id"]
        
        if target_id == "<empty>":
            url = f"{base_url}/auth/logout/"
        else:
            url = f"{base_url}/auth/logout/{target_id}"
        
        # Headers logic
        headers = {"Content-Type": "application/json"}
        if send_auth == "True":
            headers["Authorization"] = self.auth_token
        elif send_auth == "invalid_token":
            headers["Authorization"] = "Bearer invalid.token.here"

        # FIRE THE REQUEST
        response = make_request(method, url, headers=headers)
        
        print(f"[{tc_name}] {method} {url} -> {response.status_code}")

        # 1. Verify Status Code
        assert response.status_code == exp_code, (
            f"Failed for {tc_name} | Expected {exp_code}, got {response.status_code}."
        )

        try:
            body = response.json()
        except ValueError:
            # Plan text responses (e.g. 404 Cannot GET)
            assert exp_msg.lower() in response.text.lower(), f"Response mismatches expected string: {response.text}"
            return

        # 2. Schema Validation
        if response.status_code == 200:
            LogoutResponse(**body)
        else:
            LogoutErrorResponse(**body)

        # 3. Message verification
        actual_msg = body.get("message", body.get("error", ""))
        assert exp_msg.lower() in actual_msg.lower(), (
            f"[{tc_name}] Message mismatch. Expected '{exp_msg}', got '{actual_msg}'"
        )

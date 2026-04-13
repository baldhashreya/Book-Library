import pytest
import time
import requests as _requests
from pydantic import ValidationError

from .common import load_csv_data, make_request
from .schemas.refresh_token_schema import RefreshTokenSuccessResponse, RefreshTokenErrorResponse, RefreshTokenRequest

# Load scenarios from centralized CSV
refresh_scenarios = load_csv_data("refresh_token.csv")


class TestRefreshToken:
    """
    Data-driven test suite for the Refresh Token API.
    Handles valid, invalid, security, and edge cases.
    """

    @pytest.fixture(scope="class", autouse=True)
    def persistent_login(self, base_url, perform_login, login_data):
        """
        Provides persistent access and refresh tokens.
        """
        login_resp = perform_login(base_url, login_data)
        if login_resp.status_code != 200:
            pytest.fail(f"Persistent Setup Failed: {login_resp.status_code}")
        
        data = login_resp.json().get("data", {})
        self.__class__.persistent_token = data.get("access_token")
        self.__class__.persistent_refresh_token = data.get("refresh_token")
        
        # Resolve User ID
        profile_resp = _requests.get(
            f"{base_url}/profile/me",
            headers={"Authorization": self.__class__.persistent_token},
            timeout=5,
        )
        self.__class__.persistent_user_id = profile_resp.json().get("data", {}).get("_id", "")

    def _resolve_token(self, token_placeholder, user_id):
        if str(token_placeholder) == "VALID_TOKEN":
            return self.persistent_refresh_token
        elif str(token_placeholder) == "EXPIRED_TOKEN":
            # Just a syntactically valid JWT that will fail verification (causing 401)
            return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MDAwMDAwMDB9.invalid_sig"
        elif str(token_placeholder) == "TAMPERED_TOKEN":
            return self.persistent_refresh_token + "tampered"
        elif str(token_placeholder) == "MALFORMED_JWT":
            return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
        elif str(token_placeholder) == "MISSING_TOKEN":
            return None
        elif str(token_placeholder) == "NULL_TOKEN":
            return None
        elif str(token_placeholder) == "EMPTY_TOKEN":
            return ""
        elif str(token_placeholder) == "WHITESPACE_TOKEN":
            return "   "
        elif str(token_placeholder) == "LARGE_PAYLOAD":
            return "A" * 10000
        elif str(token_placeholder) == "MISSING_CLAIMS":
            return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.invalid_sig"
        elif str(token_placeholder) == "FUTURE_TOKEN":
            return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjQ1MDAwMDAwMDB9.invalid_sig"
        elif str(token_placeholder) == "INVALID_FORMAT":
            return "this-is-not-a-jwt"
        elif str(token_placeholder) == "12345":
            return 12345
        
        return token_placeholder

    @pytest.mark.parametrize(
        "data",
        refresh_scenarios,
        ids=[row["test_case_id"] for row in refresh_scenarios]
    )
    def test_refresh_token(self, base_url, data):
        tc_id     = data["test_case_id"]
        exp_code  = int(data["expected_status"])
        exp_msg   = data["expected_message"]
        method    = data.get("http_method", "PATCH")

        url = f"{base_url}/auth/refresh-token"
        
        token = data["token"]
        if "EXTRA_FIELDS" in str(token):
            payload = {"token": self.persistent_refresh_token, "extra": "field"}
        elif "INVALID_JSON" in str(token):
            payload = "{"
        elif str(token) == "MISSING_TOKEN":
            payload = {}
        else:
            resolved_token = self._resolve_token(token, self.persistent_user_id)
            payload = {"token": resolved_token} if resolved_token is not None else {"token": None}

        try:
            if isinstance(payload, dict) and tc_id not in ("TC-REFRESH-25", "TC-REFRESH-11"):
                RefreshTokenRequest(**payload)
        except ValidationError as e:
            if exp_code == 200:
                pytest.fail(f"[PRE-CHECK] {tc_id} - Positive test data failed local validation: {str(e)}")

        headers = {"Content-Type": "application/json"}
        if "NO_HEADERS" in str(token):
            headers = {}
            payload = '{"token":"' + self.persistent_refresh_token + '"}' 
        
        if "INVALID_JSON" in str(token) or "NO_HEADERS" in str(token):
            response = _requests.request(method, url, headers=headers, data=payload)
        else:
            response = make_request(method, url, json=payload, headers=headers)

        print(f"[{tc_id}] {method} {url} -> {response.status_code}")

        # 1. Verify Status Code
        assert response.status_code == exp_code, (
            f"Failed for {tc_id} | Expected {exp_code}, got {response.status_code}. Response: {response.text}"
        )

        try:
            body = response.json()
        except ValueError:
            if response.status_code >= 404 or exp_code >= 400:
                assert exp_msg.lower() in response.text.lower(), f"HTTP error text mismatch. Expected {exp_msg}, Got: {response.text}"
                return
            pytest.fail(f"[{tc_id}] Response is not valid JSON: {response.text}")

        # 2. Schema Validation
        try:
            if response.status_code == 200:
                RefreshTokenSuccessResponse(**body)
            else:
                RefreshTokenErrorResponse(**body)
        except ValidationError as e:
            pytest.fail(f"[{tc_id}] Pydantic validation error: {e}")

        # 3. Message verification
        actual_msg = body.get("message", body.get("error", ""))
        if "validation" in body:
            actual_msg = body.get("message", "")
            
        assert exp_msg.lower() in actual_msg.lower(), (
            f"[{tc_id}] Message mismatch. Expected '{exp_msg}', got '{actual_msg}'"
        )

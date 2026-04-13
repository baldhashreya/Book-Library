import pytest
import requests as _requests
from pydantic import ValidationError

from tests.common import load_csv_data, make_request
from tests.schemas.reset_password_schema import (
    ResetPasswordSuccessResponse, 
    ResetPasswordErrorResponse, 
    ResetPasswordRequest
)

# Load scenarios from centralized CSV
reset_scenarios = load_csv_data("auth/reset_password.csv")

class TestResetPassword:
    """
    Data-driven test suite for the Reset Password API.
    Handles valid, invalid, validation, and security edge cases.
    """

    @pytest.fixture(scope="class", autouse=True)
    def setup_isolated_user(self, base_url):
        """
        Creates a dedicated, isolated test user for the reset-password suite.
        Ensures idempotency since reset-password permanently alters credentials.
        """
        import time
        unique_id = int(time.time() * 1000)
        self.__class__.valid_email = f"reset_target_{unique_id}@example.com"
        
        signup_payload = {
            "name": "Reset Test User",
            "email": self.__class__.valid_email,
            "password": "InitialPassword123!",
            "role": "690c71ec375b27b523fbb5ca"
        }
        
        signup_resp = _requests.post(f"{base_url}/auth/signup", json=signup_payload)
        
        if signup_resp.status_code not in (200, 201) and "User is already exists" not in signup_resp.text:
            pytest.fail(f"Isolated Setup Failed. Could not create target user: {signup_resp.text}")

    def _resolve_field(self, field_value, default_valid_email):
        """
        Resolves CSV placeholders to structural payload permutations dynamically.
        """
        if str(field_value) == "VALID_EMAIL":
            return default_valid_email
        elif str(field_value) == "  VALID_EMAIL  ":
            return f"  {default_valid_email}  "
        elif str(field_value) == "EMPTY_FIELD":
            return ""
        elif str(field_value) == "NULL_FIELD":
            return None
        elif str(field_value) == "12345":
            return 12345
        elif str(field_value) == "LONG_PASSWORD":
            return "P" * 1000
        elif str(field_value) == "LONG_DOMAIN_STR":
            prefix = "v@"
            return prefix + ("A" * (254 - len(prefix) - 4)) + ".com"
        
        return field_value

    @pytest.mark.parametrize(
        "data",
        reset_scenarios,
        ids=[row["test_case_id"] for row in reset_scenarios]
    )
    def test_reset_password(self, base_url, data):
        tc_id     = data["test_case_id"]
        exp_code  = int(data["expected_status"])
        exp_msg   = data["expected_message"]
        method    = data.get("http_method", "POST")

        url = f"{base_url}/auth/reset-password"
        
        email_val = data["email"]
        pass_val = data["password"]

        payload = {}
        headers = {"Content-Type": "application/json"}
        send_as_raw_data = False

        if "MISSING_BODY" in str(email_val):
            payload = "{}"
            headers = {}
            send_as_raw_data = True
        elif "INVALID_JSON" in str(email_val):
            payload = "{invalid_json: true"
            send_as_raw_data = True
        else:
            if "MISSING_EMAIL" not in str(email_val):
                payload["email"] = self._resolve_field(email_val, self.valid_email)
            if "MISSING_PASSWORD" not in str(pass_val):
                payload["password"] = self._resolve_field(pass_val, self.valid_email)
            
            if "EXTRA_FIELDS" in str(email_val):
                payload["email"] = self.valid_email
                payload["extra_field"] = "haxor"

        # Pre-validation via strictly mapped Pydantic models (skip broken schemas intended for fail checks)
        try:
            if isinstance(payload, dict) and tc_id not in ("TC-RESETP-19", "TC-RESETP-11", "TC-RESETP-12"):
                ResetPasswordRequest(**payload)
        except ValidationError as e:
            if exp_code == 200:
                pytest.fail(f"[PRE-CHECK] {tc_id} - Positive test data failed local validation: {str(e)}")

        kwargs = {"headers": headers}
        if send_as_raw_data:
            kwargs["data"] = payload
        else:
            kwargs["json"] = payload

        # FIRE THE REQUEST
        if send_as_raw_data:
            response = _requests.request(method, url, **kwargs)
        else:
            response = make_request(method, url, **kwargs)

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

        # 2. Schema Validation & Security Check
        try:
            if response.status_code == 200:
                # 3. Security Check: Password not returned in response
                # We specifically check that the clear text password we sent is NOT returned back
                body_str = str(body)
                assert pass_val not in body_str or pass_val == "EMPTY_FIELD", f"[{tc_id}] Security Risk: Clear-text password {pass_val} was returned in the response payload!"
            else:
                ResetPasswordErrorResponse(**body)
        except ValidationError as e:
            pytest.fail(f"[{tc_id}] Pydantic validation error: {e}")

        # 3. Message verification
        actual_msg = body.get("message", body.get("error", ""))
        if "validation" in body:
            actual_msg = body.get("message", "Validation failed")
            
        assert exp_msg.lower() in actual_msg.lower(), (
            f"[{tc_id}] Message mismatch. Expected '{exp_msg}', got '{actual_msg}'"
        )

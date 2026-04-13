import pytest
import time
from pydantic import ValidationError

from tests.common import load_csv_data, make_request
from tests.schemas.signup_schema import SignupSuccessResponse, SignupErrorResponse, SignupRequest

# Load test data from the centralized CSV file (Data-Driven Testing)
signup_scenarios = load_csv_data("auth/sign_up.csv")

class TestSignup:
    """
    Production-level test suite for the Signup API.
    Covers Functional, Validation, Edge Cases, and Security payloads.
    """

    @pytest.mark.parametrize(
        "data",
        signup_scenarios,
        ids=[row["test_case_name"] for row in signup_scenarios]
    )
    def test_user_signup_flow(self, base_url, data):
        """
        Main test execution flow: 
        1. Pre-validates request body via Pydantic.
        2. Dispatches API call.
        3. Validates response schema and business logic.
        """
        tc_name = data["test_case_name"]
        expected_status = int(data["expected_status_code"])
        expected_msg = data["expected_message"]

        # --- 1. Payload Preparation ---
        # Generate a unique email for all cases except the duplicate-check scenario.
        # This ensures tests are idempotent and can run multiple times without manual DB cleanup.
        email_to_send = data["email"]
        if tc_name != "TC-SIGNUP-09":
            timestamp = int(time.time() * 1000)
            email_parts = email_to_send.split("@")
            if len(email_parts) == 2:
                email_to_send = f"{email_parts[0]}+{timestamp}@{email_parts[1]}"

        payload = {
            "name": data["name"],
            "email": email_to_send,
            "password": data["password"],
            "role": data["role"]
        }

        # --- 2. REQUEST VALIDATION (PRE-CHECK) ---
        # As requested, we validate the request body against our Pydantic model first.
        # This prevents 'garbage' data from our own test code, though we allow malformed 
        # data for negative test cases to hit the server for Joi verification.
        try:
            SignupRequest(**payload)
            print(f"[PRE-CHECK] {tc_name} - Request schema is valid.")
        except ValidationError as e:
            if expected_status == 200:
                pytest.fail(f"[PRE-CHECK] {tc_name} - Positive test data failed local validation: {str(e)}")
            else:
                print(f"[PRE-CHECK] {tc_name} - Caught local validation error as expected: {str(e)}")

        # --- 3. Duplicate Setup (Conditional) ---
        # For the duplicate test case, we must ensure the user exists first.
        url = f"{base_url}/auth/signup"
        if tc_name == "TC-SIGNUP-09":
            setup_resp = make_request("POST", url, json=payload)
            print(f"[SETUP] Creating initial user for duplicate check: {setup_resp.status_code}")

        # --- 4. API EXECUTION ---
        response = make_request("POST", url, json=payload)
        
        # Log for clear visibility in pytest output (-s)
        print(f"[{tc_name}] HTTP {response.status_code} | Body: {response.text}")

        # --- 5. RESPONSE VALIDATION ---
        
        # A. Assert HTTP Status Code
        assert response.status_code == expected_status, (
            f"Failed status code for {tc_name}. Expected {expected_status}, got {response.status_code}"
        )

        try:
            body = response.json()
        except ValueError:
            pytest.fail(f"[{tc_name}] Response is not valid JSON: {response.text}")

        # B. Schema Contract Validation
        try:
            if response.status_code == 200:
                SignupSuccessResponse(**body)
            else:
                SignupErrorResponse(**body)
            print(f"[VALIDATION] {tc_name} - Response schema matches model.")
        except ValidationError as e:
            pytest.fail(f"[{tc_name}] Response schema mismatch: {str(e)}")

        # C. Message Integrity Check
        actual_msg = body.get("message", "")
        assert expected_msg.lower() in actual_msg.lower(), (
            f"[{tc_name}] Message mismatch. Expected '{expected_msg}', got '{actual_msg}'"
        )

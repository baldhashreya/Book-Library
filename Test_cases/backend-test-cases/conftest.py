import pytest
import json
import os
import requests
from tests.common import load_csv_data
from tests.schemas.login_schema import LoginRequest
from pydantic import ValidationError

@pytest.fixture(scope="session")
def config():
    env = os.getenv("PYTEST_ENV", "local")
    config_path = os.path.join(os.path.dirname(__file__), "config", f"{env}.json")
    
    if not os.path.exists(config_path):
        pytest.fail(f"Config file not found: {config_path}")
        
    with open(config_path) as f:
        return json.load(f)

@pytest.fixture(scope="session")
def base_url(config):
    return config.get("base_url")

@pytest.fixture(scope="session")
def login_data():
    path = os.path.join(os.path.dirname(__file__), "..", "data", "login.json")
    with open(path) as f:
        return json.load(f)

@pytest.fixture(scope="session")
def signup_data():
    path = os.path.join(os.path.dirname(__file__), "..", "data", "signup.json")
    with open(path) as f:
        return json.load(f)

@pytest.fixture(scope="session")
def book_mapping():
    path = os.path.join(os.path.dirname(__file__), "..", "data", "books", "create_book.json")
    if not os.path.exists(path):
        return {}
    with open(path) as f:
        return json.load(f)


@pytest.fixture(scope="session")
def perform_login():
    def _login(base_url, login_data):
        payload = login_data
        try:
            model_instance = LoginRequest(**login_data)
            payload = model_instance.model_dump()
            print(f"\n[VALIDATION] Success. Data parsed using Pydantic.")
        except ValidationError as e:
            print(f"\n[VALIDATION] Warning: {e}")

        return requests.post(f"{base_url}/auth/login", json=payload)
        
    return _login

@pytest.fixture(scope="session", autouse=True)
def initialize_global_test_user(base_url, signup_data, login_data, perform_login):
    """
    Guarantees the global test user securely exists in the DB before any test classes
    try to indiscriminately run setups that require them.
    """
    resp = perform_login(base_url, login_data)
    if resp.status_code == 200:
        return  # User already fully synchronized and active
    
    # Needs to be created
    requests.post(f"{base_url}/auth/signup", json=signup_data)
    
    # Wait, lets ensure it successfully registered
    final_resp = perform_login(base_url, login_data)
    if final_resp.status_code != 200:
        pytest.fail(f"CRITICAL: Failed to automatically provision global test user dataset. Code {final_resp.status_code}")

@pytest.fixture(scope="session")
def auth_token(base_url, login_data, perform_login):
    # Relies on initialize_global_test_user already having run
    response = perform_login(base_url, login_data)
    if response.status_code == 200:
        return response.json().get("data", {}).get("access_token")
    return None

@pytest.fixture(scope="session")
def headers(auth_token):
    if auth_token:
        return {
            "Authorization": auth_token,
            "Content-Type": "application/json",
        }
    # Fallback: no auth (tests expecting 401 will still pass)
    return {"Content-Type": "application/json"}


@pytest.fixture(scope="session")
def logout_csv():
    return load_csv_data("auth/logout_test_data.csv")

@pytest.fixture(scope="session")
def api_client(base_url, headers):
    import requests
    class APIClient:
        def __init__(self, base_url, headers):
            self.base_url = base_url
            self.headers = headers
            self.session = requests.Session()
            self.session.headers.update(headers)
            
        def post(self, endpoint, **kwargs):
            req_headers = kwargs.pop("headers", self.headers)
            return self.session.post(f"{self.base_url}{endpoint}", headers=req_headers, **kwargs)
            
        def get(self, endpoint, **kwargs):
            req_headers = kwargs.pop("headers", self.headers)
            return self.session.get(f"{self.base_url}{endpoint}", headers=req_headers, **kwargs)
            
    return APIClient(base_url, headers)


import pytest
import requests

@pytest.fixture
def profile_url(base_url):
    return f"{base_url}/profile"

class TestProfile:
    def test_get_profile_me(self, profile_url):
        """Test for GET /api/profile/me"""
        pass

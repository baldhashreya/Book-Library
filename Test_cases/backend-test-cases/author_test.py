import pytest
import requests

@pytest.fixture
def author_url(base_url):
    return f"{base_url}/author"

class TestAuthor:
    def test_get_author(self, author_url):
        """Test for GET /api/author/:id"""
        pass

    def test_create_author(self, author_url):
        """Test for POST /api/author"""
        pass

    def test_update_author(self, author_url):
        """Test for PUT /api/author/:id"""
        pass

    def test_delete_author(self, author_url):
        """Test for DELETE /api/author/:id"""
        pass

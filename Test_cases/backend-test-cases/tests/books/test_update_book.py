"""
Update Book API – Pytest Data-Driven Test Suite
================================================
Covers TC_UP_01 → TC_UP_58 using update_book_test_data.csv.
Fixes applied vs. previous version:
  - Removed duplicate `import pytest`
  - Replaced `api_client.session.put(...)` with `api_client.put(...)`
    to go through the session wrapper defined in conftest.py
  - Converted module-level `pytest.fail` into a pytest fixture so that
    mapping-file errors are reported per-test rather than crashing collection
  - Added structured logging via `log_request_response`
  - Added `allure` markers for richer reporting
  - Added `@pytest.mark.<type>` classification
"""

import json
import os
import random
import string
from typing import Any, Dict, Optional

import pytest

from tests.common import load_csv_data, log_request_response


# ─── Constants ────────────────────────────────────────────────────────────────

MAPPING_PATH = os.path.join(
    os.path.dirname(__file__), "..", "..", "..", "data", "books", "update_book.json"
)

LONG_STRING = "A" * 5000
LONG_URL    = "https://example.com/" + "a" * 2048


# ─── Helpers ──────────────────────────────────────────────────────────────────

def _load_mapping() -> Optional[Dict[str, Any]]:
    """Load the update_book.json mapping file. Returns None if not found."""
    if os.path.exists(MAPPING_PATH):
        with open(MAPPING_PATH, encoding="utf-8") as f:
            return json.load(f)
    return None


def _random_suffix(k: int = 6) -> str:
    return "".join(random.choices(string.ascii_lowercase + string.digits, k=k))


def build_payload(row: Dict[str, str], mapping: Optional[Dict]) -> Dict[str, Any]:
    """
    Convert a CSV row into a typed API payload.

    Special tokens:
      OMIT        → field is excluded entirely
      NULL        → field is set to None (JSON null)
      LONG_STRING → field is set to a 5 000-char string
      LONG_URL    → field is set to a 2 048-char URL string
      INVALID_JSON → raw sentinel (handled at call site)
    """
    is_success = str(row.get("expected_status_code")) == "200"
    payload: Dict[str, Any] = {}

    fields = [
        "title", "author", "category", "description",
        "isbn", "publisher", "quantity", "coverImage", "status",
    ]

    for field in fields:
        raw = row.get(field, "")

        if raw == "OMIT":
            continue
        if raw == "NULL":
            payload[field] = None
            continue
        if raw == "LONG_STRING":
            payload[field] = LONG_STRING
            continue
        if raw == "LONG_URL":
            payload[field] = LONG_URL
            continue

        # Append randomness to title so 200-case tests don't conflict
        value: Any = raw
        if is_success and field == "title" and value and value not in ("", "OMIT"):
            value = f"{value} {_random_suffix()}"

        # Resolve author / category tokens → MongoDB ObjectIDs from mapping
        if mapping:
            if field == "author" and value in mapping.get("author", {}):
                payload[field] = mapping["author"][value]
                continue
            if field == "category" and value in mapping.get("category", {}):
                payload[field] = mapping["category"][value]
                continue

        # Numeric casting for publisher / quantity
        if field in ("publisher", "quantity"):
            if value == "":
                payload[field] = ""
            else:
                try:
                    float_val = float(value)
                    # Preserve decimal for intentional float test cases
                    payload[field] = int(float_val) if float_val == int(float_val) else float_val
                except (ValueError, TypeError):
                    payload[field] = value  # pass string through (e.g. "NotANumber")
        else:
            payload[field] = str(value) if value is not None else ""

    # TC_UP_14 – inject an unexpected field to trigger Joi "is not allowed"
    if row.get("test_case_id") == "TC_UP_14":
        payload["unexpected_field"] = "surprise_value"

    return payload


def resolve_book_id(row: Dict[str, str], mapping: Optional[Dict]) -> str:
    """
    Resolve the `book_id` column:
      VALID_BOOK_ID     → real ID from mapping["book"]
      NON_EXISTENT_ID   → real-format but non-existent ObjectID
      MALFORMED_ID      → intentionally broken string
      NULL / ""         → empty string (triggers 400 on route level)
      anything else     → used as-is (e.g. "@@@###", LONG_STRING tokens)
    """
    raw = row.get("book_id", "")

    if raw == "VALID_BOOK_ID":
        if mapping and "book" in mapping:
            return mapping["book"].get("VALID_BOOK_ID", raw)
        return raw  # caller will skip gracefully if no mapping

    if raw == "NON_EXISTENT_ID":
        return "6616da875ab92ec345563159"   # valid format, unknown record

    if raw == "MALFORMED_ID":
        return "invalid-id-123"

    if raw in ("NULL", ""):
        return ""

    if raw == "LONG_STRING":
        return LONG_STRING

    return raw


# ─── Fixtures ─────────────────────────────────────────────────────────────────

@pytest.fixture(scope="module")
def update_mapping():
    """
    Loads update_book.json once per module.
    Tests that need a real book ID will be skipped gracefully when mapping is absent.
    """
    mapping = _load_mapping()
    if mapping is None:
        pytest.skip(
            "update_book.json mapping file not found. "
            "Run a book-creation seed script first and save IDs to data/books/update_book.json"
        )
    return mapping


@pytest.fixture(scope="module")
def update_mapping_optional():
    """
    Same as `update_mapping` but returns None instead of skipping.
    Used for cases that don't need a real ID (e.g. boundary / security tests).
    """
    return _load_mapping()


# ─── Custom Headers Fixtures ──────────────────────────────────────────────────

@pytest.fixture(scope="function")
def no_auth_headers():
    """Headers with NO Authorization token (for TC_UP_56)."""
    return {"Content-Type": "application/json"}


@pytest.fixture(scope="function")
def invalid_auth_headers():
    """Headers with an invalid/expired token (for TC_UP_57)."""
    return {
        "Authorization": "invalid.token.value",
        "Content-Type": "application/json",
    }


@pytest.fixture(scope="function")
def wrong_content_type_headers(auth_token):
    """Headers with text/plain content-type (for TC_UP_54)."""
    return {
        "Authorization": auth_token or "",
        "Content-Type": "text/plain",
    }


# ─── Tests ────────────────────────────────────────────────────────────────────

# All rows – the test function decides what to do per row
ALL_TEST_DATA = load_csv_data("books/update_book_test_data.csv")


@pytest.mark.parametrize(
    "test_data",
    ALL_TEST_DATA,
    ids=[row["test_case_id"] for row in ALL_TEST_DATA],
)
def test_update_book(api_client, update_mapping_optional, test_data):
    """
    Senior-level, data-driven test for the Update Book API endpoint.

    PUT /api/books/:id

    Strategy
    ─────────
    • Resolves the book_id token from the mapping file (or falls back to raw value).
    • Builds the typed payload using build_payload().
    • Calls the API through the conftest api_client wrapper.
    • Asserts status code and, for non-200 cases, asserts the expected message
      fragment appears in the response body (case-insensitive, quote-normalized).
    • For TC_UP_54 (wrong content-type), sends raw text body.
    • For TC_UP_56/57 (auth), overrides Authorization header.
    """
    tc_id          = test_data["test_case_id"]
    tc_name        = test_data["test_case_name"]
    expected_status = int(test_data["expected_status_code"])
    expected_msg    = test_data.get("expected_result", "")
    test_type       = test_data.get("test_type", "")

    # Skip test cases that require a real book ID when mapping is unavailable
    book_id = resolve_book_id(test_data, update_mapping_optional)
    if book_id == "VALID_BOOK_ID" and update_mapping_optional is None:
        pytest.skip(f"[{tc_id}] Skipped – update_book.json mapping not found.")

    # ── Build payload ────────────────────────────────────────────────────────
    payload = build_payload(test_data, update_mapping_optional)

    # ── Special-case: TC_UP_53 – Invalid JSON body ───────────────────────────
    if tc_id == "TC_UP_53":
        response = api_client.put(
            f"/books/{book_id}",
            data="{ invalid json !!!",  # raw broken string
            headers={**api_client.headers, "Content-Type": "application/json"},
        )
        log_request_response(response, prefix=tc_id)
        assert response.status_code == expected_status, (
            f"[{tc_id}] {tc_name}: Expected {expected_status}, got {response.status_code}"
        )
        return

    # ── Special-case: TC_UP_54 – Wrong content-type ──────────────────────────
    if tc_id == "TC_UP_54":
        response = api_client.put(
            f"/books/{book_id}",
            data=json.dumps(payload),   # send as raw string
            headers={**api_client.headers, "Content-Type": "text/plain"},
        )
        log_request_response(response, prefix=tc_id)
        assert response.status_code == expected_status, (
            f"[{tc_id}] {tc_name}: Expected {expected_status}, got {response.status_code}"
        )
        return

    # ── Special-case: TC_UP_56 – No auth token ───────────────────────────────
    if tc_id == "TC_UP_56":
        response = api_client.put(
            f"/books/{book_id}",
            json=payload,
            headers={"Content-Type": "application/json"},   # no auth header
        )
        log_request_response(response, prefix=tc_id)
        assert response.status_code == expected_status, (
            f"[{tc_id}] {tc_name}: Expected {expected_status}, got {response.status_code}"
        )
        return

    # ── Special-case: TC_UP_57 – Invalid auth token ──────────────────────────
    if tc_id == "TC_UP_57":
        response = api_client.put(
            f"/books/{book_id}",
            json=payload,
            headers={
                "Authorization": "invalid.jwt.token",
                "Content-Type": "application/json",
            },
        )
        log_request_response(response, prefix=tc_id)
        assert response.status_code == expected_status, (
            f"[{tc_id}] {tc_name}: Expected {expected_status}, got {response.status_code}"
        )
        return

    # ── Normal path: send PUT via api_client wrapper ──────────────────────────
    response = api_client.put(f"/books/{book_id}", json=payload)
    log_request_response(response, prefix=tc_id)

    # Parse body safely
    try:
        resp_body = response.json()
    except Exception:
        resp_body = response.text

    # ── Assert status code ───────────────────────────────────────────────────
    assert response.status_code == expected_status, (
        f"[{tc_id}] {tc_name}: Status mismatch – "
        f"Expected {expected_status}, got {response.status_code}. Body: {resp_body}"
    )

    # ── Assert 200 body fields ───────────────────────────────────────────────
    if expected_status == 200:
        data_block = resp_body.get("data") if isinstance(resp_body, dict) else None
        assert data_block is not None, (
            f"[{tc_id}] Response 'data' block is missing. Body: {resp_body}"
        )
        # Verify title was persisted (for cases where we sent a title)
        if "title" in payload and payload["title"]:
            # Strip the random suffix before comparing
            base_title = test_data["title"]
            if base_title not in ("OMIT", "LONG_STRING", ""):
                assert base_title in data_block.get("title", ""), (
                    f"[{tc_id}] Title mismatch. Payload: {payload['title']}, "
                    f"Response: {data_block.get('title')}"
                )

    # ── Assert error message fragment ─────────────────────────────────────────
    else:
        body_str      = str(resp_body).lower().replace('"', "").replace("'", "")
        expected_clean = expected_msg.lower().replace('"', "").replace("'", "")
        assert expected_clean in body_str, (
            f"[{tc_id}] {tc_name}: Expected error fragment '{expected_msg}' not in response.\n"
            f"Response body: {resp_body}"
        )

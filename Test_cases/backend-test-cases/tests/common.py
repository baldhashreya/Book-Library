import csv
import os
from typing import Any, Dict, Optional

import requests


def load_csv_data(file_name: str) -> list[Dict[str, str]]:
    path = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "..", "data", file_name)
    )

    if not os.path.exists(path):
        raise FileNotFoundError(
            f"[load_csv_data] CSV file not found at resolved path: {path}"
        )

    rows: list[Dict[str, str]] = []
    with open(path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(dict(row))

    return rows


def make_get_request(
    url: str,
    headers: Optional[Dict[str, str]] = None,
    params: Optional[Dict[str, Any]] = None,
    timeout: int = 10,
) -> requests.Response:
    return requests.get(url, headers=headers, params=params, timeout=timeout)


def make_request(
    method: str,
    url: str,
    headers: Optional[Dict[str, str]] = None,
    json: Optional[Dict[str, Any]] = None,
    params: Optional[Dict[str, Any]] = None,
    timeout: int = 10,
) -> requests.Response:
    return requests.request(
        method=method.upper(),
        url=url,
        headers=headers,
        json=json,
        params=params,
        timeout=timeout,
    )

def build_dynamic_payload(data: dict, string_fields: list, numeric_fields: list) -> dict:
    """Takes a dictionary (like a CSV row) and gracefully structures it into a type-validated JSON payload dict."""
    payload = {}
    for field in string_fields:
        csv_val = data.get(field, "")
        api_field = "description" if field == "book_description" else field
        if csv_val == "OMIT":
            continue
        elif csv_val == "NULL":
            payload[api_field] = None
        elif csv_val == "LONG_STRING":
            payload[api_field] = "A" * 10000 
        else:
            if csv_val != "":
                payload[api_field] = str(csv_val)

    for field in numeric_fields:
        csv_val = data.get(field, "")
        if csv_val == "OMIT":
            continue
        elif csv_val == "NULL":
            payload[field] = None
        else:
            try:
                val = float(csv_val)
                payload[field] = int(val) if val.is_integer() else val
            except ValueError:
                if csv_val != "":
                    payload[field] = csv_val

    # Generic Array Parsing
    order_val = data.get("order")
    if order_val and order_val != "OMIT":
        import json
        try:
            if order_val.startswith("["):
                payload["order"] = json.loads(order_val.replace("'", '"'))
            else:
                payload["order"] = [order_val]
        except Exception:
            payload["order"] = order_val
            
    return payload

def read_json(file_name: str) -> dict:
    """Reads a JSON file from the data directory and returns it."""
    import json
    path = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "..", "data", file_name)
    )
    if not os.path.exists(path):
        raise FileNotFoundError(f"[read_json] JSON file not found: {path}")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def replace_placeholders(value: str, env_data: dict) -> str:
    """Takes a key and replaces it with values from env_data if it matches a placeholder."""
    if not isinstance(value, str):
        return value
        
    if value in env_data:
        return env_data[value]
        
    if value == "EMPTY": return ""
    if value == "NULL": return None
    if value == "LONG_STRING": return "A" * 1500
    
    return value

def log_request_response(response: requests.Response, prefix="API"):
    """
    Standard QA logging helper for printing formatted request/response data.
    """
    print(f"\n[{prefix}] ====== REQUEST ======")
    print(f"Method: {response.request.method}")
    print(f"URL: {response.request.url}")
    print(f"Headers: {response.request.headers}")
    if response.request.body:
        print(f"Body: {response.request.body}")
        
    print(f"\n[{prefix}] ====== RESPONSE ======")
    print(f"Status Code: {response.status_code}")
    print(f"Response Time: {response.elapsed.total_seconds()}s")
    try:
        print(f"Body: {response.json()}")
    except ValueError:
        print(f"Text: {response.text}")
    print("===============================\n")

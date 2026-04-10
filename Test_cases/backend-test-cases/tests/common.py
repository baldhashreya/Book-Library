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

from dataclasses import dataclass
from typing import Optional, Any

@dataclass
class BookModel:
    title: str
    author: Optional[Any] = None
    category: Optional[Any] = None
    quantity: Optional[int] = 0
    issuedBook: Optional[int] = 0
    _id: Optional[str] = None

    @classmethod
    def from_dict(cls, data: dict):
        valid_keys = cls.__dataclass_fields__.keys()
        filtered_data = {k: v for k, v in data.items() if k in valid_keys}
        return cls(**filtered_data)

from dataclasses import dataclass, field
from typing import Optional, Any, Union

@dataclass
class UserModel:
    name: str
    email: str
    role: Optional[Any] = None
    address: Optional[str] = None
    phone: Optional[Union[int, str]] = None
    status: Optional[str] = None
    _id: Optional[str] = None

    @classmethod
    def from_dict(cls, data: dict):
        # Filter out keys that are not in the dataclass
        valid_keys = cls.__dataclass_fields__.keys()
        filtered_data = {k: v for k, v in data.items() if k in valid_keys}
        return cls(**filtered_data)

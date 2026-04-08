from dataclasses import dataclass
from typing import Optional

@dataclass
class RoleModel:
    name: str
    _id: Optional[str] = None

    @classmethod
    def from_dict(cls, data: dict):
        valid_keys = cls.__dataclass_fields__.keys()
        filtered_data = {k: v for k, v in data.items() if k in valid_keys}
        return cls(**filtered_data)

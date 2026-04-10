from typing import Any, Optional
from pydantic import BaseModel, Field


class LogoutResponse(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        description="Human-readable result message from the server.",
    )
    data: Any = Field(
        description="Optional payload; typically the Mongoose UpdateResult on success.",
    )


class LogoutErrorResponse(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        description="Error description returned by the server.",
    )

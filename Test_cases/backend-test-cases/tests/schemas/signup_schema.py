from typing import Any, Optional
from pydantic import BaseModel, Field


class SignupSuccessResponse(BaseModel):
    message: str = Field(
        ..., 
        min_length=1, 
        description="The localized success message from the server."
    )
    data: Any = Field(
        description="The created user object or registration metadata."
    )


class SignupErrorResponse(BaseModel):
    """
    Schema for error responses (Celebrate/Joi or global error handler).
    """
    message: str
    error: Optional[str] = None
    statusCode: Optional[int] = None
    validation: Optional[dict] = None
    error_code: Optional[str] = None
    data: Optional[Any] = None


class SignupRequest(BaseModel):
    name: str = Field(..., min_length=1)
    email: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)
    role: str = Field(..., min_length=1)

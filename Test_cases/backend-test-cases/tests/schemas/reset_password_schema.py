from typing import Any, Optional
from pydantic import BaseModel

class ResetPasswordSuccessResponse(BaseModel):
    """Schema for a successful password reset response."""
    message: str
    data: Any

class ResetPasswordErrorResponse(BaseModel):
    """Schema for an error response (Joi validation or global error handler)."""
    message: str
    error: Optional[str] = None
    statusCode: Optional[int] = None
    validation: Optional[dict] = None
    error_code: Optional[str] = None
    data: Optional[Any] = None

class ResetPasswordRequest(BaseModel):
    """Schema for the reset password request payload for pre-validation."""
    email: Any
    password: Any

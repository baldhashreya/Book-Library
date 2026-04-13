from typing import Any, Optional
from pydantic import BaseModel

class RefreshTokenSuccessResponse(BaseModel):
    """Schema for a successful token refresh response."""
    message: str
    data: Any

class RefreshTokenErrorResponse(BaseModel):
    """Schema for an error response (Joi validation or global error handler)."""
    message: str
    error: Optional[str] = None
    statusCode: Optional[int] = None
    validation: Optional[dict] = None
    error_code: Optional[str] = None
    data: Optional[Any] = None

class RefreshTokenRequest(BaseModel):
    """Schema for the refresh token request payload."""
    token: Any

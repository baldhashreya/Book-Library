from pydantic import BaseModel, Field

class LoginRequest(BaseModel):
    email: str = Field(..., min_length=1, description="The user's email address")
    password: str = Field(..., min_length=1, description="The user's password")

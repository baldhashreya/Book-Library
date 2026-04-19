from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class BookDataSchema(BaseModel):
    id: str
    title: str = Field(..., min_length=3, max_length=50)
    author: str
    category: str
    description: str
    isbn: Optional[str] = None
    publisher: int
    quantity: int
    coverImage: Optional[str] = None
    status: str
    createdAt: Optional[str | datetime] = None
    updatedAt: Optional[str | datetime] = None
    deletedAt: Optional[str | datetime] = None

class GetBookResponseSchema(BaseModel):
    message: str
    data: Optional[BookDataSchema] = None

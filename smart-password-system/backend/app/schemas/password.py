from datetime import datetime

from pydantic import BaseModel


# Request schema (input)
class PasswordCreate(BaseModel):
    length: int
    include_symbols: bool
    include_numbers: bool


# Response schema (output)
class PasswordResponse(BaseModel):
    password: str
    strength_score: float


# DB response schema
class PasswordHistory(BaseModel):
    id: int
    password: str
    length: int
    has_symbols: bool
    has_numbers: bool
    strength_score: float
    create_at: datetime

    class Config:
        from_attributes = True

import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"

class UserStatus(str, Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"
    BLOCKED = "blocked"

class UserBase(BaseModel):
    name: str = Field(max_length=128)
    email: str = Field(max_length=340)
    phone_number: str = Field(max_length=16)
    company_name: str | None = Field(max_length=64)
    avatar_photo_id: Optional[int] = None

class UserCreate(UserBase):
    password: str = Field(max_length=128)
    avatar_photo_id: int | None = Field(None, exclude=True) # don't allow to set avatar_photo_id on creation, we allow it after creation only

class UserGet(UserBase):
    id: int
    role: str
    registration_date: datetime.datetime
    status: str
    
class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None
    company_name: Optional[str] = None
    avatar_photo_id: Optional[int] = None
import datetime
from enum import Enum
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
    avatar_photo_id: int | None

class UserRegister(UserBase):
    password: str = Field(max_length=128)
    avatar_photo_id: int | None = Field(None, exclude=True) # don't allow to set avatar_photo_id on creation, we allow it after creation only

class UserCreate(UserRegister):
    role: str = "user"

class UserGet(UserBase):
    id: int
    role: str
    registration_date: datetime.datetime
    status: str
    
class UserUpdate(UserBase):
    pass
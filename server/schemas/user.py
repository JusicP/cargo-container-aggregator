import datetime
from enum import Enum
from pydantic import BaseModel, Field, ConfigDict
from typing import Annotated


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
    company_name: str | None = Field(default=None, max_length=64)
    avatar_photo_id: int | None

class UserRegister(UserBase):
    password: str = Field(max_length=128)
    avatar_photo_id: Annotated[int | None, Field(default=None, exclude=True)] # don't allow to set avatar_photo_id on creation, we allow it after creation only

class UserCreate(UserRegister):
    role: UserRole = UserRole.USER

class UserGet(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    role: UserRole
    registration_date: datetime.datetime
    status: UserStatus
    
class UserUpdate(UserBase):
    pass
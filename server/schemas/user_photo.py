import datetime
from pydantic import BaseModel, Field


class UserPhotoBase(BaseModel):
    filename: str = Field(max_length=2048)

class UserPhotoGet(UserPhotoBase):
    user_id: int
    photo_id: int
    uploaded_at: datetime.datetime

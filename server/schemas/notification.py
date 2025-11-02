import datetime
from enum import Enum
from pydantic import BaseModel, Field
from typing import Dict, Any

from server.models.enums.notification_type import NotificationType


class UserNotificationBase(BaseModel):
    type: NotificationType = Field(..., description="Тип сповіщення")
    args: Dict[str, Any] = Field(..., description="Додаткові аргументи для фронтенду")


class UserNotificationCreate(UserNotificationBase):

    pass


class UserNotificationGet(UserNotificationBase):
    id: int
    created_at: datetime.datetime
    read_at: datetime.datetime | None = None

    class Config:
        from_attributes = True

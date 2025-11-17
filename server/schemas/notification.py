import datetime
from pydantic import BaseModel, Field, ConfigDict
from typing import Any, Dict

from server.models.enums.notification_type import NotificationType


class UserNotificationBase(BaseModel):
    type: NotificationType = Field(..., description="Тип сповіщення")
    args: dict[str, Any] = Field(..., description="Додаткові аргументи для фронтенду")


class UserNotificationCreate(UserNotificationBase):
    pass


class UserNotificationGet(UserNotificationBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime.datetime
    read_at: datetime.datetime | None = None
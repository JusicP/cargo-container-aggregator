import datetime
from sqlalchemy import ForeignKey, Enum, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from server.database.base import Base
from .enums.notification_type import NotificationType

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from .user import User


class UserNotification(Base):
    __tablename__ = "user_notifications"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
        nullable=False
    )

    type: Mapped[NotificationType] = mapped_column(
        Enum(NotificationType),
        nullable=False
    )

    args: Mapped[dict] = mapped_column(
        JSON,
        nullable=False
    )

    read_at: Mapped[datetime.datetime | None] = mapped_column(
        default=None
    )

    created_at: Mapped[datetime.datetime] = mapped_column(
        default=lambda: datetime.datetime.now(datetime.timezone.utc),
        nullable=False
    )

    user: Mapped["User"] = relationship(
        "User",
        back_populates="notifications"
    )

import datetime
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from server.database.base import Base

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from .user import User


# photos uploaded by users and listing parser for profile or listings
class UserPhoto(Base):
    __tablename__ = "user_photos"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="CASCADE", use_alter=True))
    filename: Mapped[str | None] = mapped_column(String(2048))
    uploaded_at: Mapped[datetime.datetime] = mapped_column(default=datetime.datetime.now(datetime.timezone.utc))

    user: Mapped["User"] = relationship(
        "User",
        back_populates="photos",
        foreign_keys=[user_id],
    )

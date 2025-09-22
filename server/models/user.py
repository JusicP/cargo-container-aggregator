import datetime
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from server.database.connection import Base

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from .user_photo import UserPhoto
    from .user_favorite_listing import UserFavoriteListing

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column(String(128))
    email: Mapped[str] = mapped_column(String(340), unique=True)
    password: Mapped[str]
    role: Mapped[str] = mapped_column(String(32), default="user") # user, admin
    registration_date: Mapped[datetime.datetime] = mapped_column(default=datetime.datetime.now(datetime.timezone.utc))
    status: Mapped[str] = mapped_column(String(32), default="active") # active, suspended, blocked
    phone_number: Mapped[str] = mapped_column(String(16))
    company_name: Mapped[str | None] = mapped_column(String(64))
    avatar_photo_id: Mapped[int | None] = mapped_column(ForeignKey("user_photos.id", ondelete="SET NULL"))

    favorite_listings: Mapped[list["UserFavoriteListing"]] = relationship(
        "UserFavoriteListing",
        cascade="all, delete-orphan"
    )

    photos: Mapped[list["UserPhoto"]] = relationship(
        "UserPhoto",
        back_populates="user",
        foreign_keys="UserPhoto.user_id",
        cascade="all, delete-orphan"
    )

    def is_admin(self) -> bool:
        return self.role == "admin"

import datetime
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from server.database.connection import Base


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

    favorite_listings = relationship(
        "UserFavoriteListing",
        cascade="all, delete-orphan"
    )
    photos = relationship(
        "UserPhoto",
        back_populates="user",
        cascade="all, delete-orphan"
    )

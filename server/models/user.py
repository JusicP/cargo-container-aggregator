import datetime
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from database.db import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int | None] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column(String(128))
    email: Mapped[str] = mapped_column(String(340), unique=True)
    password: Mapped[str] = mapped_column()
    role: Mapped[str] = mapped_column() # user, admin
    registration_date: Mapped[datetime.datetime] = mapped_column()
    status: Mapped[str] = mapped_column(String(32)) # active, suspended, blocked
    phone_number: Mapped[str] = mapped_column(String(16))
    company_name: Mapped[str | None] = mapped_column(String(64))

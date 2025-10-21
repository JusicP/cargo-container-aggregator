import datetime
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from server.database.base import Base


class ListingParser(Base):
    __tablename__ = "listings_parser"

    id: Mapped[int] = mapped_column(primary_key=True)
    company_name: Mapped[str] = mapped_column(String(64))
    method: Mapped[str | None] = mapped_column(String(64))
    
    url: Mapped[str] = mapped_column(String(2048))
    location: Mapped[str] = mapped_column(String(128))
    container_type: Mapped[str] = mapped_column(String(128)) # 20ft, 40ft...
    condition: Mapped[str] = mapped_column(String(64)) # new, used
    type: Mapped[str] = mapped_column(String(64)) # sale, rent
    currency: Mapped[str] = mapped_column(String(3))

    addition_date: Mapped[datetime.datetime] = mapped_column(default=datetime.datetime.now(datetime.timezone.utc))
    last_started_at: Mapped[datetime.datetime | None]
    last_finished_at: Mapped[datetime.datetime | None]

<<<<<<< HEAD
    status: Mapped[str] = mapped_column(String(64), default="done") # running, error, done
=======
    status: Mapped[str] = mapped_column(String(64), default="done")
>>>>>>> test/crud
    error_message: Mapped[str | None] = mapped_column(String(256))
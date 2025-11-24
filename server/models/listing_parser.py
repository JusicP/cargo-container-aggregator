import datetime
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from server.database.base import Base
from server.schemas.container import ContainerCondition, ContainerDimension, ContainerType
from server.schemas.listing import ListingType


class ListingParser(Base):
    __tablename__ = "listings_parser"

    id: Mapped[int] = mapped_column(primary_key=True)
    company_name: Mapped[str] = mapped_column(String(64))
    method: Mapped[str | None] = mapped_column(String(64))
    
    url: Mapped[str] = mapped_column(String(2048))
    location: Mapped[str] = mapped_column(String(128))
    container_type: Mapped[ContainerType] = mapped_column(String(128)) # 20ft, 40ft...
    condition: Mapped[ContainerCondition] = mapped_column(String(64)) # new, used
    dimension: Mapped[ContainerDimension] = mapped_column(String(64))
    type: Mapped[ListingType] = mapped_column(String(64)) # sale, rent
    currency: Mapped[str] = mapped_column(String(3))

    addition_date: Mapped[datetime.datetime] = mapped_column(default=datetime.datetime.now(datetime.timezone.utc))
    last_started_at: Mapped[datetime.datetime | None]
    last_finished_at: Mapped[datetime.datetime | None]

    status: Mapped[str] = mapped_column(String(64), default="done") # running, error, done
    error_message: Mapped[str | None] = mapped_column(String(256))

    listings = relationship("Listing", back_populates="parser", cascade="all, delete-orphan")
import datetime
from sqlalchemy import ForeignKey, String, and_, DateTime, Float, Text
from sqlalchemy import Enum as SAEnum, and_
from sqlalchemy.orm import Mapped, mapped_column, relationship

from server.database.base import Base
from server.models.listing_history import ListingHistory
from server.schemas.container import (
    ContainerType,
    ContainerCondition,
    ContainerDimension,
)

from server.models.listing_history import ListingHistory
from server.schemas.listing import ListingStatus


class Listing(Base):
    __tablename__ = "listings"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE", name="fk_listing_user_id"),
        nullable=True,
    )
    parser_id: Mapped[int | None] = mapped_column(
        ForeignKey("listings_parser.id", ondelete="CASCADE", name="fk_listing_parser_id"),
        nullable=True,
    )

    title: Mapped[str] = mapped_column(String(128))
    description: Mapped[str] = mapped_column(String(2048))

    container_type: Mapped[ContainerType] = mapped_column(String(128))
    condition: Mapped[ContainerCondition] = mapped_column(String(64))
    dimension: Mapped[ContainerDimension] = mapped_column(String(64))
    type: Mapped[str] = mapped_column(String(64))

    currency: Mapped[str | None] = mapped_column(String(3))
    location: Mapped[str] = mapped_column(String(128))
    ral_color: Mapped[str | None] = mapped_column(String(7), nullable=True)

    addition_date: Mapped[datetime.datetime] = mapped_column(default=datetime.datetime.now(datetime.timezone.utc))
    approval_date: Mapped[datetime.datetime | None]
    updated_at: Mapped[datetime.datetime | None]

    original_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)

    status: Mapped[ListingStatus] = mapped_column(String(64), default="pending") # active|pending|rejected|deleted

    analytics = relationship("ListingAnalytics", uselist=False, back_populates="listing")
    history = relationship("ListingHistory", back_populates="listing", cascade="all, delete-orphan")
    photos = relationship("ListingPhoto", back_populates="listing", cascade="all, delete-orphan")
    parser = relationship("ListingParser", uselist=False, backref="listing", lazy="selectin", viewonly=True)
    last_history: Mapped["ListingHistory"] = relationship(
        "ListingHistory",
        uselist=False,
        primaryjoin=and_(
            ListingHistory.listing_id == id,
            ListingHistory.addition_date.is_(None)
        ),
        viewonly=True,
        lazy="selectin" 
    )
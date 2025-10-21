import datetime
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from server.database.base import Base


class Listing(Base):
    __tablename__ = "listings"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey('users.id', ondelete='CASCADE', name='fk_listing_user_id'))

    title: Mapped[str] = mapped_column(String(128))
    description: Mapped[str] = mapped_column(String(2048)) 

    container_type: Mapped[str] = mapped_column(String(128)) # 20ft, 40ft...
    condition: Mapped[str] = mapped_column(String(64)) # new, used
    type: Mapped[str] = mapped_column(String(64)) # sale, rent

    price: Mapped[float | None]
    currency: Mapped[str | None] = mapped_column(String(128))
    location: Mapped[str] = mapped_column(String(128))
    ral_color: Mapped[str | None] = mapped_column(String(7)) # RAL0000

    addition_date: Mapped[datetime.datetime] = mapped_column(default=datetime.datetime.now(datetime.timezone.utc))
    approval_date: Mapped[datetime.datetime | None]
    updated_at: Mapped[datetime.datetime | None]

    original_url: Mapped[str | None] = mapped_column(String(2048))

    status: Mapped[str] = mapped_column(String(64), default="active") # active|pending|rejected|deleted

    analytics = relationship("ListingAnalytics", uselist=False, back_populates="listing")
    history = relationship("ListingHistory", back_populates="listing", cascade="all, delete-orphan")
    photos = relationship("ListingPhoto", back_populates="listing", cascade="all, delete-orphan")
    
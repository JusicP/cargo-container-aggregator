import datetime
from sqlalchemy import JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from server.database.base import Base
from server.models.listing import Listing


class ListingAnalytics(Base):
    __tablename__ = "listings_analytics"

    listing_id: Mapped[int] = mapped_column(
        ForeignKey('listings.id', ondelete='CASCADE', name='fk_listing_analytics_listing_id'),
        primary_key=True
    )
    
    average_price: Mapped[float | None]
    min_price: Mapped[float | None]
    max_price: Mapped[float | None]

    price_trend: Mapped[dict] = mapped_column(JSON, default={})  # e.g., {"2023-01-01": 1000, "2023-01-02": 1050}

    views: Mapped[int] = mapped_column(default=0)
    contacts: Mapped[int] = mapped_column(default=0)
    favorites: Mapped[int] = mapped_column(default=0)
    updated_at: Mapped[datetime.datetime]

    listing: Mapped[Listing] = relationship("Listing", viewonly=True)
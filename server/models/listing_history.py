import datetime
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from server.database.base import Base


class ListingHistory(Base):
    __tablename__ = "listings_history"

    id: Mapped[int] = mapped_column(primary_key=True)

    listing_id: Mapped[int] = mapped_column(ForeignKey('listings.id', ondelete='CASCADE', name='fk_favorite_listing_user_id'))
    
    price: Mapped[float | None]
    views: Mapped[int] = mapped_column(default=0)
    contacts: Mapped[int] = mapped_column(default=0)
    favorites: Mapped[int] = mapped_column(default=0)
    
    addition_date: Mapped[datetime.datetime]

    listing = relationship("Listing", back_populates="history")
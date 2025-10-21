import datetime
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from server.database.base import Base


class ListingPhoto(Base):
    __tablename__ = "listings_photo"

    id: Mapped[int] = mapped_column(primary_key=True)
    listing_id: Mapped[int] = mapped_column(ForeignKey("listings.id", ondelete="CASCADE"))
    photo_id: Mapped[int] = mapped_column(ForeignKey("user_photos.id", ondelete="CASCADE"))
    
    is_main: Mapped[bool] = mapped_column(default=False)
    addition_date: Mapped[datetime.datetime] = mapped_column(default=datetime.datetime.now(datetime.timezone.utc))

    listing = relationship("Listing", back_populates="photos")
    photo = relationship("UserPhoto")

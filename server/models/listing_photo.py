import datetime
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from server.database.connection import Base


class ListingPhoto(Base):
    __tablename__ = "listings_photo"

    id: Mapped[int] = mapped_column(primary_key=True)
    listing_id: Mapped[int] = mapped_column(ForeignKey("listings.id", ondelete="CASCADE"))
    url: Mapped[str] = mapped_column(String(2048))
    is_main: Mapped[bool] = mapped_column(default=False)
    uploaded_at: Mapped[datetime.datetime] = mapped_column(default=datetime.datetime.now(datetime.timezone.utc))

    listing = relationship("Listing", back_populates="photos")

import datetime
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from server.database.connection import Base
from server.models.listing import Listing


class UserFavoriteListing(Base):
    __tablename__ = "user_favorite_listings"

    user_id: Mapped[int] = mapped_column(
        ForeignKey('users.id', ondelete='CASCADE', name='fk_ufl_favorite_listing_user_id'),
        primary_key=True
    )
    listing_id: Mapped[int] = mapped_column(
        ForeignKey('listings.id', ondelete='CASCADE', name='fk_favorite_listing_id'),
        primary_key=True
    )
    addition_date: Mapped[datetime.datetime] = mapped_column(default=datetime.datetime.now(datetime.timezone.utc))

    listing: Mapped[Listing] = relationship(
        "Listing",
        viewonly=True,
        cascade="all, delete-orphan"
    )
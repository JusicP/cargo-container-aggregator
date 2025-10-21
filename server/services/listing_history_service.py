from sqlalchemy.ext.asyncio import AsyncSession

from server.models.listing import Listing
from server.models.listing_history import ListingHistory

async def create_listing_history(session: AsyncSession, listing: Listing):
    history = ListingHistory(
        listing_id=listing.id,
        price=listing.price,
        views=0,
        contacts=0,
        favorites=0,
        addition_date=listing.addition_date,
    )

    session.add(history)
    await session.commit()
    await session.refresh(history)
    return history
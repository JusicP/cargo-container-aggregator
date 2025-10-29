from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from server.models.listing import Listing
from server.models.listing_history import ListingHistory

async def create_listing_history(session: AsyncSession, listing: Listing, use_last_analytics: bool = False):
    if use_last_analytics:

        last_history = await session.execute(
            select(ListingHistory)
            .where(ListingHistory.listing_id == listing.id)
            .order_by(ListingHistory.addition_date.desc())
        )
        last_history = last_history.scalars().first()
        views = last_history.views if last_history else 0
        contacts = last_history.contacts if last_history else 0
        favorites = last_history.favorites if last_history else 0
    else:
        views = 0
        contacts = 0
        favorites = 0

    history = ListingHistory(
        listing_id=listing.id,
        price=listing.price,
        views=views,
        contacts=contacts,
        favorites=favorites,
        addition_date=listing.addition_date,
    )
    session.add(history)
    await session.commit()
    await session.refresh(history)
    return history

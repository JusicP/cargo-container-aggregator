import datetime
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from server.models.listing import Listing
from server.models.listing_history import ListingHistory

async def create_listing_history(session: AsyncSession, price: float | None, listing: Listing, use_last_analytics: bool = False):
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
        price=price,
        views=views,
        contacts=contacts,
        favorites=favorites,
        addition_date=datetime.datetime.now(datetime.UTC) if use_last_analytics else None,
    )
    session.add(history)
    await session.commit()
    await session.refresh(history)
    return history

import datetime
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from server.models.listing_history import ListingHistory
from server.models.listing import Listing


# -----------------------------
#  HELPERS: increment / decrement
# -----------------------------

async def update_numeric_field(
    session: AsyncSession,
    listing_id: int,
    field: str,
    delta: int
):

    result = await session.execute(
        select(ListingHistory)
        .where(
            ListingHistory.listing_id == listing_id,
            ListingHistory.addition_date.is_(None)
        )
    )
    history = result.scalar_one()

    old_value = getattr(history, field)
    new_value = old_value + delta
    setattr(history, field, new_value)

    session.add(history)
    await session.commit()
    await session.refresh(history)

    return new_value


async def increment_views(session: AsyncSession, listing_id: int):
    return await update_numeric_field(session, listing_id, "views", 1)


async def increment_favorites(session: AsyncSession, listing_id: int):
    return await update_numeric_field(session, listing_id, "favorites", 1)


async def decrement_favorites(session: AsyncSession, listing_id: int):
    return await update_numeric_field(session, listing_id, "favorites", -1)


async def increment_contacts(session: AsyncSession, listing_id: int):
    return await update_numeric_field(session, listing_id, "contacts", 1)


# --------------------------------------------
# DAILY SNAPSHOT JOB (update_listing_history)
# --------------------------------------------

async def update_listing_history(session: AsyncSession, listing: Listing):

    result = await session.execute(
        select(ListingHistory)
        .where(
            ListingHistory.listing_id == listing.id,
            ListingHistory.addition_date.is_(None)
        )
    )
    live_history = result.scalar_one_or_none()
    if not live_history:
        return None

    result = await session.execute(
        select(ListingHistory)
        .where(
            ListingHistory.listing_id == listing.id,
            ListingHistory.addition_date.is_not(None)
        )
        .order_by(ListingHistory.addition_date.desc())
    )
    snapshot = result.scalar_one_or_none()

    if not snapshot:
        new_snap = ListingHistory(
            listing_id=listing.id,
            price=live_history.price,
            views=live_history.views,
            contacts=live_history.contacts,
            favorites=live_history.favorites,
            addition_date=datetime.datetime.now(datetime.UTC)
        )
        session.add(new_snap)
        await session.commit()
        await session.refresh(new_snap)
        return new_snap

    changed = (
        snapshot.price != live_history.price or
        snapshot.views != live_history.views or
        snapshot.contacts != live_history.contacts or
        snapshot.favorites != live_history.favorites
    )

    if not changed:
        return None


    new_snap = ListingHistory(
        listing_id=listing.id,
        price=live_history.price,
        views=live_history.views,
        contacts=live_history.contacts,
        favorites=live_history.favorites,
        addition_date=datetime.datetime.now(datetime.UTC)
    )
    session.add(new_snap)
    await session.commit()
    await session.refresh(new_snap)
    return new_snap

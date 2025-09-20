from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from server.models.listing import Listing
from server.schemas.listing import ListingCreate, ListingGet


async def create_listing(session: AsyncSession, listing_create: ListingCreate):
    listing = Listing(
        user_id=listing_create.user_id,
        title=listing_create.title,
        description=listing_create.description,
        container_type=listing_create.container_type,
        condition=listing_create.condition,
        type=listing_create.type,
        price=listing_create.price,
        currency=listing_create.currency,
        location=listing_create.location,
        ral_color=listing_create.ral_color,
        original_url=listing_create.original_url,
    )
    session.add(listing)
    await session.commit()
    await session.refresh(listing)
    return listing


async def get_all_listings(session: AsyncSession):
    result = await session.execute(select(Listing))
    return result.scalars().all()

async def get_listing_by_id(session: AsyncSession, listing_id: int):
    return await session.get(Listing, listing_id)

async def update_listing(session: AsyncSession, listing_id: int, listing_get: ListingGet):
    listing = await get_listing_by_id(session, listing_id)
    if not listing:
        raise ValueError("Listing doesn't exist")

    listing.user_id = listing_get.user_id
    listing.title = listing_get.title
    listing.description = listing_get.description
    listing.container_type = listing_get.container_type
    listing.condition = listing_get.condition
    listing.type = listing_get.type
    listing.price = listing_get.price
    listing.currency = listing_get.currency
    listing.location = listing_get.location
    listing.ral_color = listing_get.ral_color
    listing.original_url = listing_get.original_url

    listing.status = listing_get.status
    listing.approval_date = listing_get.approval_date
    listing.updated_at = listing_get.updated_at

    await session.commit()
    await session.refresh(listing)
    return listing


async def delete_listing(session: AsyncSession, listing_id: int):
    listing = await get_listing_by_id(session, listing_id)
    if not listing:
        raise ValueError("Listing doesn't exist")

    await session.delete(listing)
    await session.commit()
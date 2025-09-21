import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from server.models.listing import Listing
from server.services.listing_photo_service import create_listing_photos
from server.schemas.listing import ListingCreate, ListingGet


async def create_listing(session: AsyncSession, user_id: int, listing_create: ListingCreate):
    listing = Listing(
        user_id=user_id,
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

    if getattr(listing_create, "photos", None):
        await create_listing_photos(session, listing_id=listing.id, photo_ids=listing_create.photos)

    return listing


async def get_all_listings(session: AsyncSession):
    result = await session.execute(select(Listing))
    return result.scalars().all()


async def get_listing_by_id(session: AsyncSession, listing_id: int):
    return await session.get(Listing, listing_id)


async def _ensure_can_modify_listing(session: AsyncSession, listing: Listing | None, actor_user_id: int, is_admin: bool):
    if not listing:
        raise ValueError("Listing doesn't exist")
    if not is_admin and listing.user_id != actor_user_id:
        raise PermissionError("You are not allowed to modify this listing")


async def update_listing(session: AsyncSession,actor_user_id: int,listing_id: int,listing_get: ListingGet,*,is_admin: bool = False,):
    listing = await get_listing_by_id(session, listing_id)
    await _ensure_can_modify_listing(session, listing, actor_user_id, is_admin)

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


    listing.updated_at = datetime.datetime.now(datetime.timezone.utc)

    await session.commit()
    await session.refresh(listing)
    return listing


async def delete_listing(session: AsyncSession,actor_user_id: int,listing_id: int,*,is_admin: bool = False,):
    listing = await get_listing_by_id(session, listing_id)
    await _ensure_can_modify_listing(session, listing, actor_user_id, is_admin)

    await session.delete(listing)
    await session.commit()
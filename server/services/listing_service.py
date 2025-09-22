import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from server.models.listing import Listing
from server.models.user import User
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

    await create_listing_photos(session, listing_id=listing.id, photo_ids=listing_create.photos)

    return listing


async def create_or_update_listings(session: AsyncSession, listings_create: list[ListingCreate]):
    # TODO: implement update logic
    for listing_create in listings_create:
        listing = Listing(
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
        await session.flush()
        await session.refresh(listing)

        await create_listing_photos(session, listing_id=listing.id, photo_ids=listing_create.photos)

    await session.commit()


async def get_all_listings(session: AsyncSession):
    result = await session.execute(select(Listing))
    return result.scalars().all()


async def get_listing_by_id(session: AsyncSession, listing_id: int):
    return await session.get(Listing, listing_id)


# FIXME: make permission check as fastapi dependency? 
async def get_listing_by_id_and_check_rights(session: AsyncSession, listing_id: int, user: User):
    listing = await get_listing_by_id(session, listing_id)

    if not listing:
        raise ValueError("Listing doesn't exist")
    
    if not user.is_admin() and listing.user_id != user.id:
        raise PermissionError("You are not allowed to modify this listing") # FIXME: not sure if it's suitable exception type...

    return listing


async def update_listing(session: AsyncSession, user: User, listing_id: int, listing_get: ListingGet):
    listing = await get_listing_by_id_and_check_rights(session, listing_id, user)

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


async def delete_listing(session: AsyncSession, user: User, listing_id: int):
    listing = await get_listing_by_id_and_check_rights(session, listing_id, user)

    await session.delete(listing)
    await session.commit()
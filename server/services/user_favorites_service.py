from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload 
from sqlalchemy.exc import IntegrityError

from server.models import UserFavoriteListing, Listing 
from server.services.listing_service import get_listing_by_id



async def get_favorites_by_user_id(session: AsyncSession, user_id: int):

    stmt = (
        select(UserFavoriteListing)
        .where(UserFavoriteListing.user_id == user_id)
    )
    result = await session.execute(stmt)
    return result.scalars().all()


async def add_favorite_listing(session: AsyncSession, user_id: int, listing_id: int):
 
    listing = await get_listing_by_id(session, listing_id)
    if not listing:
        raise ValueError(f"Listing with ID {listing_id} doesn't exist")

    existing_favorite = await session.get(
        UserFavoriteListing, 
        (user_id, listing_id)
    )
    if existing_favorite:
        return existing_favorite

    favorite = UserFavoriteListing(
        user_id=user_id,
        listing_id=listing_id,
    )
    
    session.add(favorite)
    
    try:
        await session.commit()
        await session.refresh(favorite)
    except IntegrityError:
        await session.rollback()
        raise Exception("Failed to add listing to favorites.")
    
    return favorite


async def remove_favorite_listing(session: AsyncSession, user_id: int, listing_id: int):

    favorite = await session.get(
        UserFavoriteListing, 
        (user_id, listing_id)
    )

    if not favorite:
        raise ValueError("Listing is not in favorites")

    await session.delete(favorite)
    await session.commit()
    
    return True
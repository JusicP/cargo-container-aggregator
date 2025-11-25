from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError

from server.models import UserFavoriteListing, Listing
from server.services.listing_service import get_listing_by_id


async def _load_favorite_listing(session: AsyncSession, user_id: int, listing_id: int):
    stmt = (
        select(UserFavoriteListing)
        .where(
            UserFavoriteListing.user_id == user_id,
            UserFavoriteListing.listing_id == listing_id
        )
        .options(
            selectinload(UserFavoriteListing.listing).selectinload(Listing.photos),
            selectinload(UserFavoriteListing.listing).selectinload(Listing.analytics),
        )
    )
    result = await session.execute(stmt)
    return result.scalar_one_or_none()


async def get_favorites_by_user_id(session: AsyncSession, user_id: int):
    stmt = (
        select(UserFavoriteListing)
        .where(UserFavoriteListing.user_id == user_id)
        .options(
            selectinload(UserFavoriteListing.listing).selectinload(Listing.photos),
            selectinload(UserFavoriteListing.listing).selectinload(Listing.analytics),
        )
    )
    result = await session.execute(stmt)
    return result.scalars().all()

async def add_favorite_listing(session: AsyncSession, user_id: int, listing_id: int):
    listing = await get_listing_by_id(session, listing_id)
    if not listing:
        raise ValueError(f"Listing with ID {listing_id} doesn't exist")


    query = select(UserFavoriteListing).where(
        UserFavoriteListing.user_id == user_id,
        UserFavoriteListing.listing_id == listing_id
    )
    result = await session.execute(query)
    existing = result.scalars().first()

    if existing:
        # ВАЖНО: Вызываем ошибку. Роутер поймает её, вернет 409 Conflict 
        # и НЕ будет увеличивать счетчик статистики.
        raise ValueError("Listing is already in favorites")

    favorite = UserFavoriteListing(user_id=user_id, listing_id=listing_id)
    session.add(favorite)

    try:
        await session.commit()
    except IntegrityError:
        await session.rollback()
        raise ValueError("Listing is already in favorites")

    return await _load_favorite_listing(session, user_id, listing_id)


async def remove_favorite_listing(session: AsyncSession, user_id: int, listing_id: int):
    favorite = await session.get(UserFavoriteListing, (user_id, listing_id))
    if not favorite:
        raise ValueError("Listing is not in favorites")

    await session.delete(favorite)
    await session.commit()
    return True

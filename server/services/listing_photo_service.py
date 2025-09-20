from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from server.models.listing_photo import ListingPhoto
from server.schemas.listing_photo import ListingPhotoCreate, ListingPhotoGet


async def create_listing_photo(session: AsyncSession, photo_create: ListingPhotoCreate):
    photo = ListingPhoto(**photo_create.model_dump())
    session.add(photo)
    await session.commit()
    await session.refresh(photo)
    return photo


async def get_all_listing_photos(session: AsyncSession):
    result = await session.execute(select(ListingPhoto))
    return result.scalars().all()


async def get_listing_photo_by_id(session: AsyncSession, photo_id: int):
    return await session.get(ListingPhoto, photo_id)


async def get_listing_photos_by_listing_id(session: AsyncSession, listing_id: int):
    result = await session.execute(select(ListingPhoto).where(ListingPhoto.listing_int == listing_id))
    return result.scalars().all()


async def update_listing_photo(session: AsyncSession, photo_id: int, photo_get: ListingPhotoGet):
    photo = await get_listing_photo_by_id(session, photo_id)
    if not photo:
        raise ValueError("Listing photo doesn't exist")

    photo.is_main = photo_get.is_main
    photo.listing_int = photo_get.listing_int
    photo.uploaded_at = photo_get.uploaded_at

    await session.commit()
    await session.refresh(photo)
    return photo


async def delete_listing_photo(session: AsyncSession, photo_id: int):
    photo = await get_listing_photo_by_id(session, photo_id)
    if not photo:
        raise ValueError("Listing photo doesn't exist")

    await session.delete(photo)
    await session.commit()

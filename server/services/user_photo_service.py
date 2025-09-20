from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from server.models.user_photo import UserPhoto
from server.schemas.user_photo import UserPhotoCreate, UserPhotoUpdate


async def create_user_photo(session: AsyncSession, user_photo_create: UserPhotoCreate):
    photo = UserPhoto(**user_photo_create.model_dump())
    session.add(photo)
    await session.commit()
    await session.refresh(photo)
    return photo


async def get_all_user_photos(session: AsyncSession):
    result = await session.execute(select(UserPhoto))
    return result.scalars().all()


async def get_user_photo_by_id(session: AsyncSession, photo_id: int):
    return await session.get(UserPhoto, photo_id)


async def get_user_photos_by_user_id(session: AsyncSession, user_id: int):
    result = await session.execute(select(UserPhoto).where(UserPhoto.user_id == user_id))
    return result.scalars().all()


async def update_user_photo(session: AsyncSession, photo_id: int, user_photo_update: UserPhotoUpdate):
    photo = await get_user_photo_by_id(session, photo_id)
    if not photo:
        raise ValueError("User photo doesn't exist")

    photo.filename = user_photo_update.filename

    await session.commit()
    await session.refresh(photo)
    return photo


async def delete_user_photo(session: AsyncSession, photo_id: int):
    photo = await get_user_photo_by_id(session, photo_id)
    if not photo:
        raise ValueError("User photo doesn't exist")

    await session.delete(photo)
    await session.commit()
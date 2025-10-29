from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from server.models.user import User
from server.models.user_photo import UserPhoto


async def create_user_photo(session: AsyncSession, user: User, filename: str):
    photo = UserPhoto(user_id=user.id, filename=filename)
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


async def get_user_photo_by_id_and_check_rights(session: AsyncSession, photo_id: int, user: User):
    photo = await get_user_photo_by_id(session, photo_id)

    if not photo:
        raise ValueError("Photo doesn't exist")
    
    if not user.is_admin() and photo.user_id != user.id:
        raise PermissionError("You are not allowed to modify this listing") # FIXME: not sure if it's suitable exception type...

    return photo


# No update for user_photo
# async def update_user_photo(session: AsyncSession, user: User, photo_id: int):
#     photo = await get_user_photo_by_id(session, photo_id)
#     if not photo:
#         raise ValueError("User photo doesn't exist")

#     photo.filename = user_photo_update.filename

#     await session.commit()
#     await session.refresh(photo)
#     return photo


async def delete_user_photo(session: AsyncSession, user: User, photo_id: int):
    photo = await get_user_photo_by_id_and_check_rights(session, photo_id, user)

    await session.delete(photo)
    await session.commit()
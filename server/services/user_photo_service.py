import urllib.request
import shutil
import os

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from server.models.user import User
from server.models.user_photo import UserPhoto

UPLOAD_DIR = "uploaded_photos" # TODO: MOVE TO ENV, ABSOULUTE PATH HERE


def save_photo_from_url(photo_url: str, file):
    req = urllib.request.Request(
        photo_url, 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    )

    with urllib.request.urlopen(req) as response:
        if response.status == 200:
            shutil.copyfileobj(response, file)
            return True
        
    return False

async def read_photo(session: AsyncSession, photo_id: int):
    result = await session.get(UserPhoto, photo_id)
    if not result:
        raise Exception("Photo not found")

    assert result.filename

    file_path = os.path.join(UPLOAD_DIR, result.filename)
    if not os.path.exists(file_path):
        raise Exception("File not found")

    with open(file_path, "rb") as f:
        image_bytes = f.read()

    return image_bytes


async def create_user_photo_and_write(session: AsyncSession, user_id: int | None = None, contents: bytes | None = None, url: str | None = None):
    if not url and not contents:
        return
    
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    photo = UserPhoto(user_id=user_id)
    session.add(photo)
    await session.flush()  

    filename = f"image_{user_id}_{photo.id}.jpg"
    file_path = os.path.join(UPLOAD_DIR, filename)

    try:
        with open(file_path, "wb") as f:
            if url:
                if not save_photo_from_url(url, f):
                    raise Exception(f"Failed to save photo from URL {url}")
            elif contents:
                f.write(contents)
            else:
                raise ValueError("No url or contents")

        photo.filename = filename
        await session.commit()
        await session.refresh(photo)
    except Exception:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise

    return photo


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
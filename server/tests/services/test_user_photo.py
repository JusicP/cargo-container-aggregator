import pytest
import datetime
from sqlalchemy.ext.asyncio import AsyncSession

from server.models.user import User
from server.schemas.user import UserCreate
from server.services.user_service import create_user
from server.services.user_photo_service import (
    create_user_photo,
    get_all_user_photos,
    get_user_photo_by_id,
    get_user_photos_by_user_id,
    get_user_photo_by_id_and_check_rights,
    delete_user_photo,
)


@pytest.mark.asyncio
async def test_create_and_get_user_photo(session: AsyncSession):
    user_data = UserCreate(
        name="photo_user",
        password="passphoto",
        email="photo_user@test.com",
        phone_number="1111111111",
        company_name="Photo Company",
        avatar_photo_id=None
    )
    await create_user(session, user_data)
    user = await session.get(User, 1)
    assert user

    photo = await create_user_photo(session, user, "avatar.png")
    assert photo.id is not None
    assert photo.filename == "avatar.png"
    assert photo.user_id == user.id
    assert isinstance(photo.uploaded_at, datetime.datetime)

    all_photos = await get_all_user_photos(session)
    assert len(all_photos) == 1

    photo_by_id = await get_user_photo_by_id(session, photo.id)
    assert photo_by_id
    assert photo_by_id.id == photo.id

    user_photos = await get_user_photos_by_user_id(session, user.id)
    assert len(user_photos) == 1
    assert user_photos[0].filename == "avatar.png"


@pytest.mark.asyncio
async def test_check_rights_and_delete_user_photo(session: AsyncSession):
    await create_user(session, UserCreate(name="user1", password="pass1", email="u1@test.com", phone_number="111", company_name="C1", avatar_photo_id=None))
    await create_user(session, UserCreate(name="user2", password="pass2", email="u2@test.com", phone_number="222", company_name="C2", avatar_photo_id=None))
    user1 = await session.get(User, 1)
    user2 = await session.get(User, 2)

    photo = await create_user_photo(session, user1, "pic1.png")

    checked_photo = await get_user_photo_by_id_and_check_rights(session, photo.id, user1)
    assert checked_photo.id == photo.id

    with pytest.raises(PermissionError):
        await get_user_photo_by_id_and_check_rights(session, photo.id, user2)

    await delete_user_photo(session, user1, photo.id)
    deleted = await get_user_photo_by_id(session, photo.id)
    assert deleted is None



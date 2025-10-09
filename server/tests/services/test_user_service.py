import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from server.models.user import User
from server.schemas.user import UserCreate, UserUpdate
from server.services.user_service import (
    create_user,
    get_all_users,
    get_user_by_id,
    get_user_by_email,
    get_user_by_phone_number,
    update_user,
    set_user_status,
)

@pytest.mark.asyncio
async def test_create_and_get_user(session: AsyncSession):
    user_data = UserCreate(
        name="test_user",
        password="test_password",
        email="test_email@gmail.com",
        phone_number="1234567890",
        company_name="Test Company",
    )
    await create_user(session, user_data)

    user = await get_user_by_id(session, 1)
    assert user is not None
    for field in ["name", "password", "email", "phone_number", "company_name"]:
        assert getattr(user, field) == getattr(user_data, field)

@pytest.mark.asyncio
async def test_get_all_users(session: AsyncSession):
    users_data = [
        UserCreate(name="user1", password="pass1", email="user1@test.com", phone_number="1111111111", company_name="Company1"),
        UserCreate(name="user2", password="pass2", email="user2@test.com", phone_number="2222222222", company_name="Company2"),
    ]
    for u in users_data:
        await create_user(session, u)

    users = await get_all_users(session)
    emails = [u.email for u in users]
    for u in users_data:
        assert u.email in emails

@pytest.mark.asyncio
async def test_get_user_by_email_and_phone(session: AsyncSession):
    user_data = UserCreate(name="user3", password="pass3", email="user3@test.com", phone_number="3333333333", company_name="Company3")
    await create_user(session, user_data)

    user_by_email = await get_user_by_email(session, user_data.email)
    user_by_phone = await get_user_by_phone_number(session, user_data.phone_number)
    assert user_by_email and user_by_email.name == user_data.name
    assert user_by_phone and user_by_phone.name == user_data.name

@pytest.mark.asyncio
async def test_update_user(session: AsyncSession):
    await create_user(session, UserCreate(name="user4", password="pass4", email="user4@test.com", phone_number="4444444444", company_name="Company4"))

    update_data = UserUpdate(name="updated_user4", email="updated_user4@test.com", phone_number="4444000000", company_name="Updated Company4", avatar_photo_id=None)
    await update_user(session, 1, update_data)

    user = await get_user_by_id(session, 1)
    for field in ["name", "email", "phone_number", "company_name"]:
        assert getattr(user, field) == getattr(update_data, field)

@pytest.mark.asyncio
async def test_set_user_status(session: AsyncSession):
    await create_user(session, UserCreate(name="user5", password="pass5", email="user5@test.com", phone_number="5555555555", company_name="Company5"))
    await set_user_status(session, 1, "suspended")
    assert (await get_user_by_id(session, 1)).status == "suspended"
    await set_user_status(session, 1, "active")
    assert (await get_user_by_id(session, 1)).status == "active"

@pytest.mark.asyncio
async def test_create_user_duplicate_email(session: AsyncSession):
    await create_user(session, UserCreate(name="dup1", password="pass1", email="dup@test.com", phone_number="1111111111", company_name="Company1"))
    with pytest.raises(IntegrityError):
        await create_user(session, UserCreate(name="dup2", password="pass2", email="dup@test.com", phone_number="2222222222", company_name="Company2"))

@pytest.mark.asyncio
async def test_nonexistent_user_queries(session: AsyncSession):
    assert await get_user_by_id(session, 999) is None
    assert await get_user_by_email(session, "noone@test.com") is None
    assert await get_user_by_phone_number(session, "0000000000") is None
    with pytest.raises(ValueError, match="User doesn't exist"):
        await update_user(session, 999, UserUpdate(name="ghost", email="ghost@test.com", phone_number="1231231234", company_name="GhostCompany", avatar_photo_id=None))

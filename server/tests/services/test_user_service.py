import pytest
from sqlalchemy.ext.asyncio import AsyncSession
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
async def test_get_all_users(session: AsyncSession):
    user1 = UserCreate(
        name="user1",
        password="pass1",
        email="user1@test.com",
        phone_number="1111111111",
        company_name="Company1",
    )
    user2 = UserCreate(
        name="user2",
        password="pass2",
        email="user2@test.com",
        phone_number="2222222222",
        company_name="Company2",
    )
    await create_user(session, user1)
    await create_user(session, user2)

    users = await get_all_users(session)
    assert len(users) >= 2
    assert any(u.email == "user1@test.com" for u in users)
    assert any(u.email == "user2@test.com" for u in users)


@pytest.mark.asyncio
async def test_get_user_by_id(session: AsyncSession):
    user_create = UserCreate(
        name="user3",
        password="pass3",
        email="user3@test.com",
        phone_number="3333333333",
        company_name="Company3",
    )
    await create_user(session, user_create)

    user = await get_user_by_id(session, 1)
    assert user is not None
    assert user.name == user_create.name


@pytest.mark.asyncio
async def test_get_user_by_email_and_phone(session: AsyncSession):
    user_create = UserCreate(
        name="user4",
        password="pass4",
        email="user4@test.com",
        phone_number="4444444444",
        company_name="Company4",
    )
    await create_user(session, user_create)

    user_by_email = await get_user_by_email(session, "user4@test.com")
    user_by_phone = await get_user_by_phone_number(session, "4444444444")

    assert user_by_email is not None
    assert user_by_email.name == "user4"

    assert user_by_phone is not None
    assert user_by_phone.name == "user4"


@pytest.mark.asyncio
async def test_update_user(session: AsyncSession):
    user_create = UserCreate(
        name="user5",
        password="pass5",
        email="user5@test.com",
        phone_number="5555555555",
        company_name="Company5",
    )
    await create_user(session, user_create)

    user_update = UserUpdate(
        name="updated_user5",
        email="updated_user5@test.com",
        phone_number="5555550000",
        company_name="Updated Company5",
        avatar_photo_id=None,
    )

    await update_user(session, 1, user_update)

    user = await get_user_by_id(session, 1)
    assert user.name == user_update.name
    assert user.email == user_update.email
    assert user.phone_number == user_update.phone_number
    assert user.company_name == user_update.company_name


@pytest.mark.asyncio
async def test_set_user_status(session: AsyncSession):
    user_create = UserCreate(
        name="user6",
        password="pass6",
        email="user6@test.com",
        phone_number="6666666666",
        company_name="Company6",
    )
    await create_user(session, user_create)

    await set_user_status(session, 1, "suspended")
    user = await get_user_by_id(session, 1)
    assert user.status == "suspended"

    await set_user_status(session, 1, "active")
    user = await get_user_by_id(session, 1)
    assert user.status == "active"

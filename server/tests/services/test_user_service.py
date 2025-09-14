import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from server.models.user import User
from server.schemas.user import UserCreate
from server.services.user_service import create_user


@pytest.mark.asyncio
async def test_user_create(session: AsyncSession):
    user_create = UserCreate(
        name="test_user",
        password="test_password",
        email="test_email@gmail.com",
        phone_number="1234567890",
        company_name="Test Company",
    )
    
    await create_user(session, user_create)

    user = await session.get(User, 1)
    assert user
    assert user.name == user_create.name
    assert user.password != user_create.password
    assert user.email == user_create.email
    assert user.phone_number == user_create.phone_number
    assert user.company_name == user_create.company_name
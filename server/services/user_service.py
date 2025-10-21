from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from server.auth.utils import hash_password
from server.schemas.user import UserCreate, UserUpdate
from server.models.user import User


async def create_user(session: AsyncSession, user_create: UserCreate):
    await check_single_email(session, None, user_create.email)
    await check_single_phone_number(session, None, user_create.phone_number)
    
    user = User(**user_create.model_dump())
    user.password = hash_password(user.password)
    session.add(user)
    
    await session.commit()
    await session.refresh(user)
    return user

async def get_all_users(session: AsyncSession):
    result = await session.execute(select(User))
    return result.scalars().all()

async def get_user_by_id(session: AsyncSession, user_id: int):
    return await session.get(User, user_id)

async def get_user_by_email(session: AsyncSession, email: str):
    result = await session.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()

async def get_user_by_phone_number(session: AsyncSession, phone_number: str):
    result = await session.execute(select(User).where(User.phone_number == phone_number))
    return result.scalar_one_or_none()

async def update_user(session: AsyncSession, user_id: int, user_update: UserUpdate):
    user = await get_user_by_id(session, user_id)
    if not user:
        raise ValueError("User doesn't exist")
    
    await check_single_email(session, user, user_update.email)
    await check_single_phone_number(session, user, user_update.phone_number)

    user.name = user_update.name
    user.email = user_update.email
    user.phone_number = user_update.phone_number
    user.company_name = user_update.company_name

    await session.commit()

# admin method to suspend/block user
async def set_user_status(session: AsyncSession, user_id: int, status: str):
    user = await get_user_by_id(session, user_id)
    if not user:
        raise ValueError("User doesn't exist")

    user.status = status

    await session.commit()

# method helpers
async def check_single_email(session: AsyncSession, user: User | None, email: str):
    existing_user = await get_user_by_email(session, email)
    if existing_user and user and user != existing_user:
        raise ValueError("User with such email already exist")

async def check_single_phone_number(session: AsyncSession, user: User | None, phone_number: str):
    existing_user = await get_user_by_phone_number(session, phone_number)
    if existing_user and user and user != existing_user:
        raise ValueError("User with such phone number already exist")

# TODO: update user password
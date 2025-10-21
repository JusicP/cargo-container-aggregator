from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from server.schemas.user import UserRegister, UserGet, UserUpdate, UserRole, UserStatus, UserCreate
from server.database.connection import generate_async_session
from server.services.user_service import (
    create_user,
    get_all_users,
    get_user_by_id,
    update_user as crud_update_user,
)

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=List[UserGet])
async def get_users(session: AsyncSession = Depends(generate_async_session)):
    users = await get_all_users(session)
    return [
        UserGet(
            id=user.id,
            name=user.name,
            email=user.email,
            phone_number=user.phone_number,
            company_name=user.company_name,
            role=user.role,
            registration_date=user.registration_date,
            status=user.status,
            avatar_photo_id=user.avatar_photo_id,
        )
        for user in users
    ]


@router.get("/me", response_model=UserGet)
async def get_me(session: AsyncSession = Depends(generate_async_session)):
    # Тут треба підставити логіку для поточного користувача
    user = await get_user_by_id(session, 1)  # тимчасово 1
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserGet(**user.__dict__)


@router.post("/register", response_model=UserGet)
async def register_user(user: UserCreate, session: AsyncSession = Depends(generate_async_session)):
    created_user = await create_user(session, user)
    return UserGet(**created_user.__dict__)


@router.put("/me", response_model=UserGet)
async def update_me(user: UserUpdate, session: AsyncSession = Depends(generate_async_session)):
    await crud_update_user(session, user_id=1, user_update=user)  # тимчасово 1
    updated_user = await get_user_by_id(session, 1)
    return UserGet(**updated_user.__dict__)


@router.get("/{id}", response_model=UserGet)
async def get_user(id: int, session: AsyncSession = Depends(generate_async_session)):
    user = await get_user_by_id(session, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserGet(**user.__dict__)


@router.put("/{id}", response_model=UserGet)
async def update_user(id: int, user: UserUpdate, session: AsyncSession = Depends(generate_async_session)):
    await crud_update_user(session, user_id=id, user_update=user)
    updated_user = await get_user_by_id(session, id)
    return UserGet(**updated_user.__dict__)

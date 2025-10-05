from fastapi import APIRouter, HTTPException
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from server.database.connection import generate_async_session
from server.schemas.user import UserCreate, UserGet, UserUpdate, UserRole, UserStatus
from server.services.user_service import get_all_users, create_user, get_user_by_id, update_user

router = APIRouter(prefix="/users", tags=["users"])

CURRENT_USER_ID = 1


@router.get("/", response_model=list[UserGet])
async def get_users(session: AsyncSession = Depends(generate_async_session)):
    users = await get_all_users(session)
    return users


@router.get("/me", response_model=UserGet)
async def get_me(session: AsyncSession = Depends(generate_async_session)):
    try:
        user = await get_user_by_id(session, CURRENT_USER_ID)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/register", response_model=UserGet)
async def register_user(
    user: UserCreate,
    session: AsyncSession = Depends(generate_async_session),
):
    try:
        await create_user(session, user)
        return user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/me", response_model=UserGet)
async def update_me(
    user_update: UserUpdate,
    session: AsyncSession = Depends(generate_async_session),
):
    try:
        updated_user = await update_user(session, CURRENT_USER_ID, user_update)

        if not updated_user:
            updated_user = await get_user_by_id(session, CURRENT_USER_ID)

        return updated_user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{id}", response_model=UserGet)
async def get_user(id: int, session: AsyncSession = Depends(generate_async_session)):
    try:
        user = await get_user_by_id(session, id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{id}", response_model=UserGet)
async def user_update(
    id: int,
    user_update: UserUpdate,
    session: AsyncSession = Depends(generate_async_session),
):
    try:
        existing_user = await get_user_by_id(session, id)
        if not existing_user:
            raise HTTPException(status_code=404, detail="User not found")

        await update_user(session, id, user_update)

        updated_user = await get_user_by_id(session, id)
        return updated_user

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
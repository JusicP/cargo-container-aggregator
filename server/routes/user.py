from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from starlette import status

from server.models import User
from server.schemas.user import UserFilterParams, UserGet, UserPaginatedGet, UserStatus, UserUpdate, UserCreate
from server.database.connection import generate_async_session
from server.services.user_service import (
    create_user,
    get_all_users_paginated,
    get_user_by_id,
    update_user as crud_update_user,
    set_user_status
)

from server.routes.dependencies import get_current_user, get_user_filters

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=UserPaginatedGet)
async def get_users(
    filters: UserFilterParams = Depends(get_user_filters),
    session: AsyncSession = Depends(generate_async_session),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100, alias="pageSize"),
):
    response = await get_all_users_paginated(session, filters, page, page_size)
    return response


@router.get("/me", response_model=UserGet)
async def get_me(current_user: User = Depends(get_current_user())):
    return UserGet.model_validate(current_user)

@router.post("/register", response_model=UserGet)
async def register_user(
    user_create: UserCreate,
    session: AsyncSession = Depends(generate_async_session)
):
    try:
        created_user = await create_user(session, user_create)
        return UserGet.model_validate(created_user)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unexpected error during registration"
        )


@router.put("/me", response_model=UserGet)
async def update_me(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user()),
    session: AsyncSession = Depends(generate_async_session),
):
    await crud_update_user(session, user_id=current_user.id, user_update=user_update)
    updated_user = await get_user_by_id(session, current_user.id)
    return UserGet.model_validate(updated_user)



@router.get("/{id}", response_model=UserGet)
async def get_user(id: int, session: AsyncSession = Depends(generate_async_session)):
    user = await get_user_by_id(session, id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return UserGet.model_validate(user)


@router.put("/{id}", response_model=UserGet)
async def update_user(
    id: int,
    user_update: UserUpdate,
    session: AsyncSession = Depends(generate_async_session)
):
    try:

        await crud_update_user(session, user_id=id, user_update=user_update)

        updated_user = await get_user_by_id(session, id)
        return UserGet.model_validate(updated_user)

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

    except Exception as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.put("/{id}/status/{status}")
async def update_user(
    id: int,
    status: UserStatus,
    session: AsyncSession = Depends(generate_async_session)
):
    await set_user_status(session, id, status)
    return {"details": "success"}

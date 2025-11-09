from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from starlette import status

from server.models import User
from server.schemas.user_favorite_listing import UserFavoriteListingGet
from server.database.connection import generate_async_session
from server.routes.dependencies import get_current_user
from server.services.user_favorites_service import (
    get_favorites_by_user_id,
    add_favorite_listing,
    remove_favorite_listing,
)

router = APIRouter(prefix="/favorites", tags=["favorites"])


@router.get("/", response_model=List[UserFavoriteListingGet])
async def get_favorites(
    current_user: User = Depends(get_current_user()),
    session: AsyncSession = Depends(generate_async_session),
):
    favorites = await get_favorites_by_user_id(session, current_user.id)
    return favorites  


@router.post("/{listing_id}", response_model=UserFavoriteListingGet)
async def add_to_favorites(
    listing_id: int,
    current_user: User = Depends(get_current_user()),
    session: AsyncSession = Depends(generate_async_session),
):
    try:
        favorite = await add_favorite_listing(session, current_user.id, listing_id)
        return favorite
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete("/{listing_id}")
async def remove_from_favorites(
    listing_id: int,
    current_user: User = Depends(get_current_user()),
    session: AsyncSession = Depends(generate_async_session),
):
    try:
        await remove_favorite_listing(session, current_user.id, listing_id)
        return {"status": "removed", "listing_id": listing_id, "user_id": current_user.id}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

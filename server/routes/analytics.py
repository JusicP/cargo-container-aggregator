from fastapi import APIRouter, Depends, HTTPException

from typing import List
from sqlalchemy.ext.asyncio import AsyncSession

from server.schemas.listing_analytics import ListingAnalyticsGet
from server.database.connection import generate_async_session
from server.services.listing_analytics_service import (
    get_all_listing_analytics,
    get_listing_analytics_by_id
)

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/market", response_model=List[ListingAnalyticsGet])
async def get_market_analytics(session: AsyncSession = Depends(generate_async_session)):
    analytics_list = await get_all_listing_analytics(session)
    return [ListingAnalyticsGet.from_orm(a) for a in analytics_list]


@router.get("/user/{user_id}", response_model=List[ListingAnalyticsGet])
async def get_user_analytics(user_id: int, session: AsyncSession = Depends(generate_async_session)):

    analytics_list = await get_all_listing_analytics(session)



    if not analytics_list:
        raise HTTPException(status_code=404, detail="Analytics not found for this user")

    return [ListingAnalyticsGet.from_orm(a) for a in analytics_list]

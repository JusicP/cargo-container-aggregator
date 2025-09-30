from fastapi import APIRouter
from typing import List
import datetime

from server.schemas.listing_analytics import ListingAnalyticsGet

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/market", response_model=List[ListingAnalyticsGet])
async def get_market_analytics():
    return [
        ListingAnalyticsGet(
            listing_id=1,
            average_price=1250.5,
            min_price=900.0,
            max_price=1600.0,
            price_trend={"2025-09-01": 1200, "2025-09-10": 1300},
            views=1500,
            contacts=230,
            favorites=120,
            updated_at=datetime.datetime.utcnow(),
        ),
        ListingAnalyticsGet(
            listing_id=2,
            average_price=750.0,
            min_price=500.0,
            max_price=950.0,
            price_trend={"2025-09-01": 700, "2025-09-10": 800},
            views=980,
            contacts=145,
            favorites=88,
            updated_at=datetime.datetime.utcnow(),
        ),
    ]


@router.get("/user/{user_id}", response_model=List[ListingAnalyticsGet])
async def get_user_analytics(user_id: int):
    if user_id == 0:
        user_id = 123

    return [
        ListingAnalyticsGet(
            listing_id=10,
            average_price=1100.0,
            min_price=850.0,
            max_price=1350.0,
            price_trend={"2025-09-05": 1000, "2025-09-15": 1150},
            views=540,
            contacts=80,
            favorites=45,
            updated_at=datetime.datetime.utcnow(),
        )
    ]

from fastapi import APIRouter
from datetime import datetime
from typing import List

from server.schemas.listing_analytics import ListingAnalyticsGet
from server.schemas.user_favorite_listing import UserFavoriteListingGet, UserFavoriteListingAdd
from server.schemas.listing import ListingGet

router = APIRouter(prefix="/favorites", tags=["favorites"])

@router.get("/", response_model=List[UserFavoriteListingGet])
async def get_favorites():
    now = datetime.utcnow()
    return [
        UserFavoriteListingGet(
            user_id=1,
            listing_id=101,
            listing=ListingGet(
                user_id=1,
                title="Cozy Apartment",
                description="2 rooms, good location",
                container_type="apartment",
                condition="good",
                type="rental",
                price=500,
                currency="USD",
                location="Kyiv",
                ral_color="N/A",
                original_url="http://example.com/apt",
                addition_date=now,
                approval_date=None,
                updated_at=now,
                status="approved",
                photos=[],
                analytics=ListingAnalyticsGet(
                    views=12,
                    favorites=4,
                    contacts=0,
                    average_price=500,
                    min_price=500,
                    max_price=500,
                    price_trend={},
                    listing_id=101,
                    updated_at=now,
                )
            ),
            addition_date=now,
        ),
        UserFavoriteListingGet(
            user_id=1,
            listing_id=102,
            listing=ListingGet(
                user_id=1,
                title="Modern Studio",
                description="Near city center",
                container_type="studio",
                condition="new",
                type="rental",
                price=350,
                currency="USD",
                location="Lviv",
                ral_color="N/A",
                original_url="http://example.com/studio",
                addition_date=now,
                approval_date=None,
                updated_at=now,
                status="approved",
                photos=[],
                analytics=ListingAnalyticsGet(
                    views=8,
                    favorites=2,
                    contacts=0,
                    average_price=350,
                    min_price=350,
                    max_price=350,
                    price_trend={},
                    listing_id=102,
                    updated_at=now,
                )
            ),
            addition_date=now,
        ),
    ]

@router.post("/{listing_id}", response_model=UserFavoriteListingGet)
async def add_to_favorites(listing_id: int, body: UserFavoriteListingAdd):
    now = datetime.utcnow()
    return UserFavoriteListingGet(
        user_id=1,
        listing_id=listing_id,
        listing=ListingGet(
            user_id=1,
            title="New Listing",
            description="Just added to favorites",
            container_type="40ft",
            condition="used",
            type="sale",
            price=400,
            currency="USD",
            location="Kyiv",
            ral_color="RAL5010",
            original_url=None,
            addition_date=now,
            approval_date=None,
            updated_at=now,
            status="pending",
            photos=[],
            analytics=ListingAnalyticsGet(
                views=0,
                favorites=0,
                contacts=0,
                average_price=400,
                min_price=400,
                max_price=400,
                price_trend={},
                listing_id=listing_id,
                updated_at=now,
            )
        ),
        addition_date=now,
    )

@router.delete("/{listing_id}")
async def remove_from_favorites(listing_id: int):
    return {
        "status": "removed",
        "listing_id": listing_id,
    }

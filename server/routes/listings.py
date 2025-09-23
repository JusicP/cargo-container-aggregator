from fastapi import APIRouter
from datetime import datetime

from server.schemas.listing import ListingGet, ListingCreate
from server.schemas.listing_analytics import ListingAnalyticsGet
from server.schemas.listing_photo import ListingPhotoGet

router = APIRouter(prefix="/listings", tags=["listings"])


@router.get("/", response_model=list[ListingGet])
async def get_listings():
    now = datetime.utcnow()
    return [
        ListingGet(
            user_id=1,
            title="40ft Container for Sale",
            description="Used 40ft container in good condition.",
            container_type="40ft",
            condition="used",
            type="sale",
            price=2500.00,
            currency="USD",
            location="Odessa, Ukraine",
            ral_color="RAL5010",
            original_url=None,
            addition_date=now,
            approval_date=now,
            updated_at=None,
            status="active",
            photos=[
                ListingPhotoGet(
                    photo_id=1,
                    url="https://example.com/photo1.jpg",
                    is_main=True,
                    listing_int=1,
                    uploaded_at=now
                )
            ],
            analytics=ListingAnalyticsGet(
                views=120,
                favorites=15,
                contacts=5,
                average_price=2500.0,
                min_price=2000.0,
                max_price=3000.0,
                price_trend={},
                listing_id=1,
                updated_at=now
            ),
        ),
        ListingGet(
            user_id=2,
            title="20ft Reefer for Rent",
            description="Reefer container, fully functional cooling system.",
            container_type="reefer",
            condition="new",
            type="rent",
            price=300.00,
            currency="EUR",
            location="Hamburg, Germany",
            ral_color=None,
            original_url="https://external-marketplace.com/container/123",
            addition_date=now,
            approval_date=None,
            updated_at=now,
            status="pending",
            photos=[
                ListingPhotoGet(
                    photo_id=2,
                    url="https://example.com/photo2.jpg",
                    is_main=True,
                    listing_int=2,
                    uploaded_at=now
                )
            ],
            analytics=ListingAnalyticsGet(
                views=50,
                favorites=5,
                contacts=2,
                average_price=300.0,
                min_price=300.0,
                max_price=300.0,
                price_trend={},
                listing_id=2,
                updated_at=now
            ),
        ),
    ]



@router.post("/", response_model=ListingGet)
async def create_listing(listing: ListingCreate):
    now = datetime.utcnow()
    listing_data = listing.dict()
    listing_data.pop("photos", None)

    return ListingGet(
        **listing_data,
        addition_date=now,
        approval_date=None,
        updated_at=now,
        status="pending",
        photos=[],
        analytics=ListingAnalyticsGet(
            views=0,
            favorites=0,
            contacts=0,
            average_price=listing.price or 0,
            min_price=listing.price or 0,
            max_price=listing.price or 0,
            price_trend={},
            listing_id=0,
            updated_at=now
        )
    )



@router.get("/{id}", response_model=ListingGet)
async def get_listing(id: str):
    now = datetime.utcnow()
    return ListingGet(
        user_id=1,
        title="40ft Container Example",
        description="Example container description.",
        container_type="40ft",
        condition="used",
        type="sale",
        price=2500.00,
        currency="USD",
        location="Odessa, Ukraine",
        ral_color="RAL5010",
        original_url=None,
        addition_date=now,
        approval_date=now,
        updated_at=now,
        status="active",
        photos=[],
        analytics=ListingAnalyticsGet(
            views=10,
            favorites=2,
            contacts=0,
            average_price=2500.0,
            min_price=2500.0,
            max_price=2500.0,
            price_trend={},
            listing_id=int(id),
            updated_at=now
        ),
    )


@router.put("/{id}", response_model=ListingGet)
async def update_listing(id: str, listing: ListingCreate):
    now = datetime.utcnow()
    data = listing.dict()
    data.pop("photos", None)
    return ListingGet(
        **data,
        addition_date=now,
        approval_date=None,
        updated_at=now,
        status="pending",
        photos=[],  #
        analytics=ListingAnalyticsGet(
            views=10,
            favorites=3,
            contacts=0,
            average_price=listing.price or 0,
            min_price=listing.price or 0,
            max_price=listing.price or 0,
            price_trend={},
            listing_id=int(id),
            updated_at=now
        ),
    )

@router.delete("/{id}")
async def delete_listing(id: str):
    return {"status": "deleted", "id": id}


@router.post("/{id}/approve")
async def approve_listing(id: str):
    return {"status": "approved", "id": id, "approval_date": datetime.utcnow()}

import datetime
from pydantic import BaseModel, Field

from server.schemas.listing_analytics import ListingAnalyticsGet
from server.schemas.listing_photo import ListingPhotoCreate, ListingPhotoGet


class ListingBase(BaseModel):
    title: str = Field(max_length=128)
    description: str = Field(max_length=2048)

    container_type: str = Field(max_length=128)
    condition: str = Field(max_length=64)
    type: str = Field(max_length=64)

    price: float | None
    currency: str = Field(max_length=3)
    location: str = Field(max_length=128)
    ral_color: str | None = Field(max_length=7)

    original_url: str | None = Field(max_length=2048)

class ListingGet(ListingBase):
    id: int
    user_id: int | None # none if listing created by parser
    addition_date: datetime.datetime
    approval_date: datetime.datetime | None
    updated_at: datetime.datetime | None

    status: str = Field(max_length=64)

    photos: list[ListingPhotoGet] = []
    analytics: ListingAnalyticsGet | None = None

class ListingFilterParams(BaseModel):
    title: str | None = None
    container_type: list[str] | None = None
    condition: list[str] | None = None
    type_: list[str] | None = None
    price_min: float | None = None
    price_max: float | None = None
    currency: str | None = None
    location: list[str] | None = None
    ral_color: list[str] | None = None
    status: str | None = None

    sort_by: str | None = "addition_date"  # addition_date, approval_date, updated_at, price
    sort_order: str | None = "desc"        # asc / desc

class ListingPaginatedGet(BaseModel):
    total: int
    page: int
    page_size: int
    total_pages: int
    listings: list[ListingGet]

class ListingCreate(ListingBase):
    photos: list[ListingPhotoCreate] = []
import datetime
from pydantic import BaseModel, Field

from server.schemas.listing_analytics import ListingAnalyticsGet
from server.schemas.listing_photo import ListingPhotoGet


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
    user_id: int | None # none if listing created by parser
    addition_date: datetime.datetime
    approval_date: datetime.datetime | None
    updated_at: datetime.datetime | None

    status: str = Field(max_length=64)

    photos: list[ListingPhotoGet] = []
    analytics: ListingAnalyticsGet
    
class ListingCreate(ListingBase):
    photos: list[int] = []
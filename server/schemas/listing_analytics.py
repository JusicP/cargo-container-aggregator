import datetime
from pydantic import BaseModel


class ListingAnalyticsBase(BaseModel):
    average_price: float | None
    min_price: float | None
    max_price: float | None

    price_trend: dict
    
    views: int
    contacts: int
    favorties: int

class ListingAnalyticsGet(ListingAnalyticsBase):
    listing_id: int
    updated_at: datetime.datetime

import datetime
from pydantic import BaseModel


class ListingPhotoBase(BaseModel):
    photo_id: int | None # possible to assign photo_id later (useful for parser)
    is_main: bool
    
class ListingPhotoGet(ListingPhotoBase):
    listing_id: int
    addition_date: datetime.datetime

class ListingPhotoCreate(ListingPhotoBase):
    photo_url: str | None = None

class ListingPhotoUpdate(ListingPhotoBase):
    pass
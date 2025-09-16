import datetime
from pydantic import BaseModel


class ListingPhotoBase(BaseModel):
    photo_id: int
    is_main: bool
    
class ListingPhotoGet(ListingPhotoBase):
    listing_int: int
    uploaded_at: datetime.datetime

class ListingPhotoCreate(ListingPhotoBase):
    pass

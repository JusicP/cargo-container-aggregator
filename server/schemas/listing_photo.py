import datetime
from pydantic import BaseModel


class ListingPhotoBase(BaseModel):
    photo_id: int
    is_main: bool
    
class ListingPhotoGet(ListingPhotoBase):
    listing_id: int
    addition_date: datetime.datetime

class ListingPhotoCreate(ListingPhotoBase):
    pass

class ListingPhotoUpdate(ListingPhotoBase):
    pass
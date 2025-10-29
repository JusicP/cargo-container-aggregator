import datetime
from pydantic import BaseModel

from server.schemas.listing import ListingGet


class UserFavoriteListingBase(BaseModel):
    listing_id: int

class UserFavoriteListingGet(UserFavoriteListingBase):
    user_id: int # FIXME: nado?
    listing: ListingGet
    addition_date: datetime.datetime
    
class UserFavoriteListingAdd(UserFavoriteListingBase):
    pass
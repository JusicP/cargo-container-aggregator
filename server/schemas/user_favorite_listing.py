import datetime
from pydantic import BaseModel, ConfigDict

from server.schemas.listing import ListingGet


class UserFavoriteListingBase(BaseModel):
    listing_id: int


class UserFavoriteListingGet(UserFavoriteListingBase):
    user_id: int
    listing: ListingGet
    addition_date: datetime.datetime

    model_config = ConfigDict(from_attributes=True)


class UserFavoriteListingAdd(UserFavoriteListingBase):
    pass

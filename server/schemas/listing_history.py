import datetime
from pydantic import BaseModel

class ListingHistoryBase(BaseModel):
    price: float | None

    views: int
    contacts: int
    favorites: int
    
    addition_date: datetime.datetime | None

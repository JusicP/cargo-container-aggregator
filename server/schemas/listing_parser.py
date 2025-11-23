import datetime
from pydantic import BaseModel, Field


class ListingParserBase(BaseModel):
    company_name: str = Field(max_length=64)
    method: str | None = Field(max_length=64)

    url: str = Field(max_length=2048)
    location: str = Field(max_length=128)
    container_type: str = Field(max_length=128)
    condition: str = Field(max_length=64)
    type: str = Field(max_length=64)
    currency: str = Field(max_length=3)

class ListingParserGet(ListingParserBase):
    id: int
    addition_date: datetime.datetime
    last_started_at: datetime.datetime | None
    last_finished_at: datetime.datetime | None

    status: str = Field(max_length=64)
    error_message: str | None = Field(max_length=256) 

class ListingParserCreate(ListingParserBase):
    pass

class ListingParserUpdate(ListingParserBase):
    company_name: str | None = Field(default=None, max_length=64)
    method: str | None = Field(default=None, max_length=64)
    url: str | None = Field(default=None, max_length=2048)
    location: str | None = Field(default=None, max_length=128)
    container_type: str | None = Field(default=None, max_length=128)
    condition: str | None = Field(default=None, max_length=64)
    type: str | None = Field(default=None, max_length=64)
    currency: str | None = Field(default=None, max_length=3)

    status: str | None = Field(default=None, max_length=64)
    error_message: str | None = Field(default=None, max_length=256)
    last_started_at: datetime.datetime | None = None
    last_finished_at: datetime.datetime | None = None

class ListingParserPaginatedGet(BaseModel):
    total: int
    page: int
    page_size: int
    total_pages: int
    listings: list[ListingParserGet]

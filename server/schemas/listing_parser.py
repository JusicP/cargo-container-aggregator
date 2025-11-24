import datetime
from pydantic import BaseModel, Field

from server.schemas.container import ContainerCondition, ContainerDimension, ContainerType
from server.schemas.listing import ListingType


class ListingParserBase(BaseModel):
    company_name: str = Field(max_length=64)
    method: str | None = Field(max_length=64)

    url: str = Field(max_length=2048)
    location: str = Field(max_length=128)
    container_type: ContainerType
    condition: ContainerCondition
    dimension: ContainerDimension
    type: ListingType
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
    container_type: ContainerType | None = Field(default=None)
    condition: ContainerCondition | None = Field(default=None)
    dimension: ContainerDimension | None = Field(default=None)
    type: ListingType | None = Field(default=None)
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

import datetime
from enum import Enum
from pydantic import BaseModel, Field

from server.schemas.container import ContainerCondition, ContainerDimension, ContainerType
from server.schemas.listing_analytics import ListingAnalyticsGet
from server.schemas.listing_history import ListingHistoryBase
from server.schemas.listing_photo import ListingPhotoCreate, ListingPhotoGet


class ListingStatus(str, Enum):
    ACTIVE = "active"
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    DELETED = "deleted"


class ListingType(str, Enum):
    SALE = "sale"
    RENT = "rent"


class ListingBase(BaseModel):
    title: str = Field(max_length=128)
    description: str = Field(max_length=2048)

    container_type: ContainerType
    condition: ContainerCondition
    dimension: ContainerDimension
    type: ListingType

    currency: str | None = Field(max_length=3)
    location: str = Field(max_length=128)
    ral_color: str | None = Field(max_length=7)

    original_url: str | None = Field(max_length=2048)


class ListingGet(ListingBase):
    id: int
    user_id: int | None # none if listing created by parser
    addition_date: datetime.datetime
    approval_date: datetime.datetime | None
    updated_at: datetime.datetime | None

    status: ListingStatus

    photos: list[ListingPhotoGet] = []
    analytics: ListingAnalyticsGet | None = None
    last_history: ListingHistoryBase


class ListingUpdate(ListingBase):
    price: float | None


class ListingFilterParams(BaseModel):
    title: str | None = None
    container_type: list[ContainerType] | None = None
    condition: list[ContainerCondition] | None = None
    type_: list[ListingType] | None = None
    price_min: float | None = None
    price_max: float | None = None
    currency: str | None = None
    location: list[str] | None = None
    ral_color: list[str] | None = None
    status: ListingStatus | None = None
    dimension: ContainerDimension | None = None

    sort_by: str | None = "addition_date"  # addition_date, approval_date, updated_at, price
    sort_order: str | None = "desc"        # asc / desc


class ListingPaginatedGet(BaseModel):
    total: int
    page: int
    page_size: int
    total_pages: int
    listings: list[ListingGet]


class ListingCreate(ListingBase):
    original_url: str | None = None
    price: float
    photos: list[ListingPhotoCreate] = []

import datetime
from enum import Enum
from pydantic import BaseModel, Field

from server.schemas.listing_analytics import ListingAnalyticsGet
from server.schemas.listing_history import ListingHistoryBase
from server.schemas.listing_photo import ListingPhotoCreate, ListingPhotoGet


class ContainerType(str, Enum):
    DRY_20 = "20' Standard Dry"
    DRY_40 = "40' Standard Dry"
    HC_40 = "40' High Cube"
    HC_45 = "45' High Cube"

    OPEN_TOP_20 = "20' Open Top"
    OPEN_TOP_40 = "40' Open Top"

    FLAT_RACK_20 = "20' Flat Rack"
    FLAT_RACK_40 = "40' Flat Rack"

    PLATFORM_20 = "20' Platform"
    PLATFORM_40 = "40' Platform"

    TANK_20 = "20' Tank Container"
    TANK_30 = "30' Tank Container"

    REEFER_20 = "20' Reefer"
    REEFER_40 = "40' Reefer"

    BULK_20 = "20' Bulk"
    BULK_40 = "40' Bulk"

    INSULATED_20 = "20' Insulated"
    INSULATED_40 = "40' Insulated"

    DOUBLE_DOOR_20 = "20' Double Door"
    DOUBLE_DOOR_40 = "40' Double Door"

    SIDE_DOOR_20 = "20' Side Door"
    SIDE_DOOR_40 = "40' Side Door"

    PALLET_WIDE_40 = "40' Pallet Wide"
    PALLET_WIDE_45 = "45' Pallet Wide"

    HALF_HEIGHT_20 = "20' Half Height"
    COLLAPSIBLE_FLAT_40 = "40' Collapsible Flat"


    MINI_10 = "10' Mini Container"
    MINI_8 = "8' Mini Container"
    MINI_6 = "6' Mini Container"


class ContainerCondition(str, Enum):
    NEW = "New"
    CARGO_WORTHY = "Cargo Worthy"
    WIND_WATER_TIGHT = "Wind & Water Tight"
    AS_IS = "As Is"
    REFURBISHED = "Refurbished"


class ContainerSaleType(str, Enum):
    FOR_SALE = "For Sale"
    FOR_RENT = "For Rent"
    LEASE_PURCHASE = "Lease Purchase"
    ONE_TRIP = "One Trip"


class ListingStatus(str, Enum):
    ACTIVE = "Active"
    PENDING = "Pending"
    APPROVED = "Approved"
    REJECTED = "Rejected"
    DELETED = "Deleted"


class ListingBase(BaseModel):
    title: str = Field(max_length=128)
    description: str = Field(max_length=2048)

    container_type: ContainerType
    condition: ContainerCondition
    type: ContainerSaleType

    currency: str | None = Field(max_length=3)
    location: str = Field(max_length=128)
    ral_color: str | None = Field(max_length=7)

    original_url: str | None = Field(max_length=2048)

class ListingGet(ListingBase):
    id: int
    user_id: int | None
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
    type_: list[ContainerSaleType] | None = None

    price_min: float | None = None
    price_max: float | None = None

    currency: str | None = None
    location: list[str] | None = None
    ral_color: list[str] | None = None

    status: ListingStatus | None = None

    sort_by: str | None = "addition_date"
    sort_order: str | None = "desc"


class ListingPaginatedGet(BaseModel):
    total: int
    page: int
    page_size: int
    total_pages: int
    listings: list[ListingGet]


class ListingCreate(ListingBase):
    price: float | None
    photos: list[ListingPhotoCreate] = []

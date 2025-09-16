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
    ral_color: str | None

    original_url: str | None = Field(max_length=2048)

class ListingParserGet(ListingParserBase):
    addition_date: datetime.datetime
    last_started_at: datetime.datetime | None
    last_finished_at: datetime.datetime | None

    status: str = Field(max_length=3)
    error_message: str = Field(max_length=256)

class ListingParserCreate(ListingParserBase):
    pass
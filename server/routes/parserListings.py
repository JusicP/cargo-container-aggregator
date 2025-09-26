from fastapi import APIRouter
from datetime import datetime

from server.schemas.listing_parser import ListingParserGet, ListingParserCreate

router = APIRouter(prefix="/parserlistings", tags=["parserlistings"])


@router.get("/", response_model=list[ListingParserGet])
async def get_parser_listings():
    return [
        ListingParserGet(
            company_name="Test Company",
            method="scraper",
            url="https://example.com/container/1",
            location="Odessa, Ukraine",
            container_type="40ft",
            condition="used",
            type="sale",
            currency="USD",
            ral_color="RAL5010",
            addition_date=datetime.now(),
            last_started_at=None,
            last_finished_at=None,
            status="NEW",
            error_message=""
        )
    ]


@router.post("/", response_model=ListingParserGet)
async def create_parser_listing(listing: ListingParserCreate):
    return ListingParserGet(
        **listing.dict(),
        addition_date=datetime.now(),
        last_started_at=None,
        last_finished_at=None,
        status="NEW",
        error_message=""
    )


@router.put("/{id}", response_model=ListingParserGet)
async def update_parser_listing(id: int, listing: ListingParserCreate):
    return ListingParserGet(
        **listing.dict(),
        addition_date=datetime.now(),
        last_started_at=datetime.now(),
        last_finished_at=None,
        status="UPD",
        error_message=""
    )


@router.delete("/{id}")
async def delete_parser_listing(id: int):
    return {"message": f"Listing {id} deleted"}


@router.post("/run")
async def run_parser():
    return {"message": "Parser started", "started_at": datetime.utcnow()}

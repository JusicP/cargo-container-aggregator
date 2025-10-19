from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession

from server.schemas.listing_parser import ListingParserGet, ListingParserCreate, ListingParserUpdate
from server.database.connection import generate_async_session
from server.services.listing_parser_service import (
    create_listing_parser,
    get_all_listing_parsers,
    get_listing_parser_by_id,
    update_listing_parser,
    delete_listing_parser,
)

router = APIRouter(prefix="/parserlistings", tags=["parserlistings"])


@router.get("/", response_model=list[ListingParserGet])
async def get_parser_listings(session: AsyncSession = Depends(generate_async_session)):
    parsers = await get_all_listing_parsers(session)
    return parsers


@router.post("/", response_model=ListingParserGet)
async def create_parser_listing(
    listing: ListingParserCreate,
    session: AsyncSession = Depends(generate_async_session),
):
    parser = await create_listing_parser(session, listing)
    return parser


@router.put("/{parser_id}", response_model=ListingParserGet)
async def update_parser_listing(
    parser_id: int,
    listing: ListingParserUpdate,
    session: AsyncSession = Depends(generate_async_session),
):
    try:
        parser = await update_listing_parser(session, parser_id, listing)
        return parser
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{parser_id}")
async def delete_parser_listing(
    parser_id: int,
    session: AsyncSession = Depends(generate_async_session),
):
    try:
        await delete_listing_parser(session, parser_id)
        return {"message": f"Listing {parser_id} deleted"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/run")
async def run_parser():
    return {"message": "Parser started", "started_at": datetime.utcnow()}

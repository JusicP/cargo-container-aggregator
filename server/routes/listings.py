from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timezone

from server.schemas.listing import ListingFilterParams, ListingGet, ListingCreate, ListingPaginatedGet, ListingStatus, ListingUpdate
from server.database.connection import generate_async_session
from server.services.listing_service import (
    create_listing as create_listing_service,
    get_all_listings_paginated as get_all_listings_service,
    get_listing_by_id as get_listing_by_id_service,
    update_listing as update_listing_service,
    delete_listing as delete_listing_service,
)
from server.models.user import User
from server.routes.dependencies import get_current_user, get_listing_filters

router = APIRouter(prefix="/listings", tags=["listings"])


@router.get("/", response_model=ListingPaginatedGet)
async def get_listings(
    filters: ListingFilterParams = Depends(get_listing_filters),
    session: AsyncSession = Depends(generate_async_session),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
):
    res = await get_all_listings_service(session, filters, page, page_size)
    return res


@router.post("/", response_model=ListingGet)
async def create_listing(
    listing: ListingCreate,
    session: AsyncSession = Depends(generate_async_session),
    current_user: User = Depends(get_current_user()),
):
    try:
        created_listing = await create_listing_service(session, current_user.id, listing)
        return created_listing
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{listing_id}", response_model=ListingGet)
async def get_listing(
    listing_id: int,
    session: AsyncSession = Depends(generate_async_session),
):
    listing = await get_listing_by_id_service(session, listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing


@router.put("/{listing_id}", response_model=ListingGet)
async def update_listing(
    listing_id: int,
    listing_data: ListingUpdate,
    session: AsyncSession = Depends(generate_async_session),
    current_user: User = Depends(get_current_user()),
):
    try:
        updated_listing = await update_listing_service(session, current_user, listing_id, listing_data)
        return updated_listing
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{listing_id}")
async def delete_listing(
    listing_id: int,
    session: AsyncSession = Depends(generate_async_session),
    current_user: User = Depends(get_current_user()),
):
    try:
        await delete_listing_service(session, current_user, listing_id)
        return {"status": "deleted", "id": listing_id}
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/{listing_id}/status/{status}")
async def update_listing_status(
    listing_id: int,
    status: ListingStatus,
    session: AsyncSession = Depends(generate_async_session),
    _: User = Depends(get_current_user()),
):
    listing = await get_listing_by_id_service(session, listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    listing.status = status
    listing.approval_date = datetime.now(timezone.utc)
    await session.commit()
    await session.refresh(listing)

    return {"status": status, "id": listing_id, "approval_date": listing.approval_date}

import datetime
from typing import Optional

from sqlalchemy import and_, asc, desc, func, select
from sqlalchemy.orm import selectinload, aliased
from sqlalchemy.ext.asyncio import AsyncSession

from server.models.listing import Listing
from server.models.listing_history import ListingHistory
from server.models.user import User
from server.services.listing_history_service import create_listing_history, update_listing_history
from server.services.listing_photo_service import create_listing_photos
from server.schemas.listing import ListingCreate, ListingFilterParams, ListingUpdate
from server.schemas.container import ContainerType, ContainerCondition, ContainerDimension


async def create_listing(session: AsyncSession, user_id: int, listing_create: ListingCreate):
    listing = Listing(
        user_id=user_id,
        title=listing_create.title,
        description=listing_create.description,
        container_type=listing_create.container_type,
        condition=listing_create.condition,
        dimension=listing_create.dimension,
        type=listing_create.type,
        currency=listing_create.currency,
        location=listing_create.location,
        ral_color=listing_create.ral_color,
        original_url=listing_create.original_url,
        price=listing_create.price,
        status="pending",
    )

    session.add(listing)
    await session.flush()

    await create_listing_photos(session, listing_id=listing.id, listing_photos=listing_create.photos)
    await create_listing_history(session, listing_create.price, listing)

    await session.commit()
    await session.refresh(listing)

    await session.execute(select(Listing).options(
        selectinload(Listing.photos),
        selectinload(Listing.analytics),
        selectinload(Listing.last_history)
    ).filter(Listing.id == listing.id))

    return listing


async def create_or_update_listings(session: AsyncSession, listings_create: list[ListingCreate]):
    for listing_create in listings_create:
        listing = Listing(
            title=listing_create.title,
            description=listing_create.description,
            container_type=listing_create.container_type,
            condition=listing_create.condition,
            dimension=listing_create.dimension,
            type=listing_create.type,
            currency=listing_create.currency,
            location=listing_create.location,
            ral_color=listing_create.ral_color,
            original_url=listing_create.original_url,
            price=listing_create.price,
            status="pending",
        )

        session.add(listing)
        await session.flush()
        await session.refresh(listing)

        await create_listing_photos(session, listing_id=listing.id, listing_photos=listing_create.photos)

    await session.commit()


async def get_all_listings_paginated(
        session: AsyncSession,
        filters: ListingFilterParams,
        page: int = 1,
        page_size: int = 20
):
    last_history_alias = aliased(ListingHistory)

    query = (
        select(Listing)
        .join(
            last_history_alias,
            and_(
                last_history_alias.listing_id == Listing.id,
                last_history_alias.addition_date.is_(None)
            ),
            isouter=True
        )
        .options(
            selectinload(Listing.photos),
            selectinload(Listing.analytics),
            selectinload(Listing.last_history)
        )
    )
    if filters.title:
        query = query.where(Listing.title.ilike(f"%{filters.title}%"))
    if filters.container_type:

        values = [ct.value if isinstance(ct, ContainerType) else str(ct) for ct in filters.container_type]
        query = query.where(Listing.container_type.in_(values))
    if filters.condition:
        values = [c.value if isinstance(c, ContainerCondition) else str(c) for c in filters.condition]
        query = query.where(Listing.condition.in_(values))
    if filters.type_:
        query = query.where(Listing.type.in_(filters.type_))
    if filters.price_min is not None:
        query = query.where(last_history_alias.price >= filters.price_min)
    if filters.price_max is not None:
        query = query.where(last_history_alias.price <= filters.price_max)
    if filters.currency:
        query = query.where(Listing.currency == filters.currency)
    if filters.location:
        query = query.where(Listing.location.in_(filters.location))
    if filters.ral_color:
        query = query.where(Listing.ral_color.in_(filters.ral_color))
    if filters.status:
        query = query.where(Listing.status == filters.status)


    where_criteria = query._where_criteria
    count_query = select(func.count()).select_from(Listing).where(*where_criteria)
    total = (await session.execute(count_query)).scalar() or 0

    sort_column_map = {
        "addition_date": Listing.addition_date,
        "approval_date": Listing.approval_date,
        "updated_at": Listing.updated_at,
        "price": last_history_alias.price,
    }
    sort_column = sort_column_map.get(filters.sort_by, Listing.addition_date)  # type: ignore

    if (filters.sort_order or "desc").lower() == "asc":
        query = query.order_by(asc(sort_column))
    else:
        query = query.order_by(desc(sort_column))

    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size)

    result = await session.execute(query)
    listings = result.scalars().all()

    total_pages = (total + page_size - 1) // page_size  # ceil

    return {
        "listings": listings,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
    }


async def get_all_listings(session: AsyncSession):
    query = select(Listing).options(
        selectinload(Listing.photos),
        selectinload(Listing.analytics),
        selectinload(Listing.last_history)
    )
    result = await session.execute(query)

    return result.scalars().all()


async def get_listing_by_id(session: AsyncSession, listing_id: int):
    result = await session.execute(select(Listing).where(Listing.id == listing_id).options(
        selectinload(Listing.photos),
        selectinload(Listing.analytics),
        selectinload(Listing.last_history)
    ))
    return result.scalars().one_or_none()


async def get_listing_by_id_and_check_rights(session: AsyncSession, listing_id: int, user: User):
    listing = await get_listing_by_id(session, listing_id)

    if not listing:
        raise ValueError("Listing doesn't exist")

    if not user.is_admin() and listing.user_id != user.id:
        raise PermissionError("You are not allowed to modify this listing")

    return listing


async def update_listing(session: AsyncSession, user: User, listing_id: int, listing_update: ListingUpdate):
    listing = await get_listing_by_id_and_check_rights(session, listing_id, user)

    for key, value in listing_update.model_dump().items():
        if hasattr(listing, key):
            setattr(listing, key, value)

    listing.updated_at = datetime.datetime.now(datetime.timezone.utc)

    await session.commit()
    await session.refresh(listing)

    await update_listing_history(session, listing_update.price, listing)

    return listing


async def delete_listing(session: AsyncSession, user: User, listing_id: int):
    listing = await get_listing_by_id_and_check_rights(session, listing_id, user)

    await session.delete(listing)
    await session.commit()

import datetime

from sqlalchemy import asc, desc, select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from server.models.listing import Listing
from server.models.user import User
from server.services.listing_history_service import create_listing_history
from server.services.listing_photo_service import create_listing_photos
from server.schemas.listing import ListingCreate, ListingFilterParams, ListingGet


async def create_listing(session: AsyncSession, user_id: int, listing_create: ListingCreate):
    listing = Listing(
        user_id=user_id,
        title=listing_create.title,
        description=listing_create.description,
        container_type=listing_create.container_type,
        condition=listing_create.condition,
        type=listing_create.type,
        price=listing_create.price,
        currency=listing_create.currency,
        location=listing_create.location,
        ral_color=listing_create.ral_color,
        original_url=listing_create.original_url,
    )

    session.add(listing)
    await session.commit()

    await create_listing_photos(session, listing_id=listing.id, listing_photos=listing_create.photos)
    await create_listing_history(session, listing)

    await session.execute(select(Listing).options(
        selectinload(Listing.photos),
        selectinload(Listing.analytics)
    ).filter(Listing.id == listing.id))

    return listing


async def create_or_update_listings(session: AsyncSession, listings_create: list[ListingCreate]):
    # TODO: implement update logic
    for listing_create in listings_create:
        listing = Listing(
            title=listing_create.title,
            description=listing_create.description,
            container_type=listing_create.container_type,
            condition=listing_create.condition,
            type=listing_create.type,
            price=listing_create.price,
            currency=listing_create.currency,
            location=listing_create.location,
            ral_color=listing_create.ral_color,
            original_url=listing_create.original_url,
        )

        session.add(listing)
        await session.flush()
        await session.refresh(listing)

        await create_listing_photos(session, listing_id=listing.id, listing_photos=listing_create.photos)

    await session.commit()


async def get_all_listings(
    session: AsyncSession,
    filters: ListingFilterParams,
    page: int = 1,
    page_size: int = 20
) -> list[Listing]:
    query = select(Listing).options(
        selectinload(Listing.photos),
        selectinload(Listing.analytics)
    )

    if filters.title:
        query = query.where(Listing.title.ilike(f"%{filters.title}%"))
    if filters.container_type:
        query = query.where(Listing.container_type.in_(filters.container_type))
    if filters.condition:
        query = query.where(Listing.condition.in_(filters.condition))
    if filters.type_:
        query = query.where(Listing.type.in_(filters.type_))
    if filters.price_min is not None:
        query = query.where(Listing.price >= filters.price_min)
    if filters.price_max is not None:
        query = query.where(Listing.price <= filters.price_max)
    if filters.currency:
        query = query.where(Listing.currency == filters.currency)
    if filters.location:
        query = query.where(Listing.location.in_(filters.location))
    if filters.ral_color:
        query = query.where(Listing.ral_color.in_(filters.ral_color))
    if filters.status:
        query = query.where(Listing.status == filters.status)

    sort_column_map = {
        "addition_date": Listing.addition_date,
        "approval_date": Listing.approval_date,
        "updated_at": Listing.updated_at,
        "price": Listing.price,
    }
    sort_column = sort_column_map.get(filters.sort_by, Listing.addition_date) # type: ignore
    if (filters.sort_order or "desc").lower() == "asc":
        query = query.order_by(asc(sort_column))
    else:
        query = query.order_by(desc(sort_column))

    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size)

    result = await session.execute(query)
    listings = result.scalars().all()
    return listings  # type: ignore


async def get_listing_by_id(session: AsyncSession, listing_id: int):
    result = await session.execute(select(Listing).where(Listing.id==listing_id).options(
        selectinload(Listing.photos),
        selectinload(Listing.analytics)
    ))
    return result.scalars().one_or_none()


# FIXME: make permission check as fastapi dependency? 
async def get_listing_by_id_and_check_rights(session: AsyncSession, listing_id: int, user: User):
    listing = await get_listing_by_id(session, listing_id)

    if not listing:
        raise ValueError("Listing doesn't exist")
    
    if not user.is_admin() and listing.user_id != user.id:
        raise PermissionError("You are not allowed to modify this listing") # FIXME: not sure if it's suitable exception type...

    return listing


async def update_listing(session: AsyncSession, user: User, listing_id: int, listing_get: ListingGet):
    listing = await get_listing_by_id_and_check_rights(session, listing_id, user)

    listing.title = listing_get.title
    listing.description = listing_get.description
    listing.container_type = listing_get.container_type
    listing.condition = listing_get.condition
    listing.type = listing_get.type
    listing.price = listing_get.price
    listing.currency = listing_get.currency
    listing.location = listing_get.location
    listing.ral_color = listing_get.ral_color
    listing.original_url = listing_get.original_url

    listing.updated_at = datetime.datetime.now(datetime.timezone.utc)

    await session.commit()
    await session.refresh(listing)

    await create_listing_history(session, listing)

    return listing


async def delete_listing(session: AsyncSession, user: User, listing_id: int):
    listing = await get_listing_by_id_and_check_rights(session, listing_id, user)

    await session.delete(listing)
    await session.commit()
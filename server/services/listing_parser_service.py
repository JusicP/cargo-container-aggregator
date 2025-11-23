from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from server.models.listing_parser import ListingParser
from server.schemas.listing_parser import ListingParserCreate, ListingParserUpdate


async def create_listing_parser(session: AsyncSession, parser_create: ListingParserCreate):
    parser = ListingParser(**parser_create.model_dump())
    session.add(parser)
    await session.commit()
    await session.refresh(parser)
    return parser

async def get_all_listing_parsers(session: AsyncSession):
    result = await session.execute(select(ListingParser))
    return result.scalars().all()

async def get_all_listing_parsers_paginated(
    session: AsyncSession,
    page: int = 1,
    page_size: int = 20
):
    query = (
        select(ListingParser)
    )

    count_query = select(func.count()).select_from(ListingParser).where(
        *query._where_criteria
    )
    total = (await session.execute(count_query)).scalar() or 0

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

async def get_listing_parser_by_id(session: AsyncSession, parser_id: int):
    return await session.get(ListingParser, parser_id)

async def update_listing_parser(session: AsyncSession, parser_id: int, parser_update: ListingParserUpdate):
    parser = await get_listing_parser_by_id(session, parser_id)
    if not parser:
        raise ValueError("Listing parser doesn't exist")

    for key, value in parser_update.model_dump(exclude_unset=True).items():
        setattr(parser, key, value)

    await session.commit()
    await session.refresh(parser)
    return parser

async def delete_listing_parser(session: AsyncSession, parser_id: int):
    parser = await get_listing_parser_by_id(session, parser_id)
    if not parser:
        raise ValueError("Listing parser doesn't exist")

    await session.delete(parser)
    await session.commit()

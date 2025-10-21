from sqlalchemy import select
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

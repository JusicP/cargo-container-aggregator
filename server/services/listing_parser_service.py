from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from server.models.listing_parser import ListingParser
from server.schemas.listing_parser import ListingParserCreate, ListingParserGet


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

async def update_listing_parser(session: AsyncSession, parser_id: int, parser_get: ListingParserGet):
    parser = await get_listing_parser_by_id(session, parser_id)
    if not parser:
        raise ValueError("Listing parser doesn't exist")

    parser.company_name = parser_get.company_name
    parser.method = parser_get.method
    parser.url = parser_get.url
    parser.location = parser_get.location
    parser.container_type = parser_get.container_type
    parser.condition = parser_get.condition
    parser.type = parser_get.type
    parser.currency = parser_get.currency

    parser.addition_date = parser_get.addition_date
    parser.last_started_at = parser_get.last_started_at
    parser.last_finished_at = parser_get.last_finished_at
    parser.status = parser_get.status
    parser.error_message = parser_get.error_message

    await session.commit()
    await session.refresh(parser)
    return parser


async def delete_listing_parser(session: AsyncSession, parser_id: int):
    parser = await get_listing_parser_by_id(session, parser_id)
    if not parser:
        raise ValueError("Listing parser doesn't exist")

    await session.delete(parser)
    await session.commit()
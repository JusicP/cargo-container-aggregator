import pytest
import datetime
from sqlalchemy.ext.asyncio import AsyncSession

from server.models.listing_parser import ListingParser
from server.schemas.listing_parser import ListingParserCreate, ListingParserGet
from server.services.listing_parser_service import (
    create_listing_parser,
    get_all_listing_parsers,
    get_listing_parser_by_id,
    update_listing_parser,
    delete_listing_parser
)


@pytest.mark.asyncio
async def test_create_listing_parser(session: AsyncSession):
    parser_data = ListingParserCreate(
        company_name="OldCompany",
        method="manual",
        url="https://old.com",
        location="Odesa",
        container_type="20ft",
        condition="used",
        type="sale",
        currency="UAH",
        error_message=""
    )
    parser = await create_listing_parser(session, parser_data)
    assert parser.id is not None
    assert parser.company_name == "OldCompany"
    assert parser.currency == "UAH"
    assert parser.status == "done"  


@pytest.mark.asyncio
async def test_get_all_and_by_id_parser(session: AsyncSession):
    parser_data = ListingParserCreate(
        company_name="FetchCompany",
        method="bot",
        url="https://fetch.com",
        location="Kyiv",
        container_type="40ft",
        condition="new",
        type="rent",
        currency="USD",
        error_message=""
    )
    parser = await create_listing_parser(session, parser_data)

    all_parsers = await get_all_listing_parsers(session)
    assert isinstance(all_parsers, list)
    assert any(p.id == parser.id for p in all_parsers)

    fetched = await get_listing_parser_by_id(session, parser.id)
    assert fetched.id == parser.id


@pytest.mark.asyncio
async def test_update_listing_parser(session: AsyncSession):
    parser_data = ListingParserCreate(
        company_name="UpdateCompany",
        method="manual",
        url="https://update.com",
        location="Lviv",
        container_type="20ft",
        condition="used",
        type="sale",
        currency="EUR",
        error_message=""
    )
    parser = await create_listing_parser(session, parser_data)

    update_data = ListingParserGet(
        company_name="UpdatedCompany",
        method="bot",
        url="https://updated.com",
        location="Lviv",
        container_type="20ft",
        condition="new",
        type="rent",
        currency="EUR",
        addition_date=parser.addition_date,
        last_started_at=None,
        last_finished_at=None,
        status="done",  
        error_message=""
    )
    updated = await update_listing_parser(session, parser.id, update_data)
    assert updated.company_name == "UpdatedCompany"
    assert updated.condition == "new"
    assert updated.currency == "EUR"


@pytest.mark.asyncio
async def test_delete_listing_parser(session: AsyncSession):
    parser_data = ListingParserCreate(
        company_name="ToDelete",
        method="bot",
        url="https://todelete.com",
        location="Kharkiv",
        container_type="20ft",
        condition="new",
        type="sale",
        currency="USD",
        error_message=""
    )
    parser = await create_listing_parser(session, parser_data)
    await delete_listing_parser(session, parser.id)

    deleted = await get_listing_parser_by_id(session, parser.id)
    assert deleted is None


@pytest.mark.asyncio
async def test_update_nonexistent_listing_parser(session: AsyncSession):
    fake_id = 999
    update_data = ListingParserGet(
        company_name="Ghost",
        method="ghost",
        url="https://ghost.com",
        location="Nowhere",
        container_type="20ft",
        condition="new",
        type="sale",
        currency="USD",
        addition_date=datetime.datetime.now(datetime.timezone.utc),
        last_started_at=None,
        last_finished_at=None,
        status="done",
        error_message=""
    )
    with pytest.raises(ValueError) as exc_info:
        await update_listing_parser(session, fake_id, update_data)
    assert str(exc_info.value) == "Listing parser doesn't exist"

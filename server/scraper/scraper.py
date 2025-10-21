import datetime
from sqlalchemy.ext.asyncio import AsyncSession

from server.schemas.listing import ListingCreate
from server.schemas.listing_parser import ListingParserUpdate
from server.scraper.company import Company
import server.services.listing_parser_service as listing_parser_service
import server.services.listing_service as listing_service


async def run_listing_scraper(session: AsyncSession):
    listings_to_parse = await listing_parser_service.get_all_listing_parsers(session)
    now = datetime.datetime.now(datetime.timezone.utc)

    for listing_parse in listings_to_parse:
        await listing_parser_service.update_listing_parser(
            session,
            listing_parse.id,
            ListingParserUpdate(
                status="running",
                last_started_at=now,
                error_message=None,
            )
        )

        try:
            company = Company.get_company(listing_parse.method or listing_parse.company_name)
            listings: list[ListingCreate] = company.get_shipping_container_prices(listing_parse)

            await listing_service.create_or_update_listings(session, listings)
            await listing_parser_service.update_listing_parser(
                session,
                listing_parse.id,
                ListingParserUpdate(
                    status="done",
                    last_finished_at=datetime.datetime.now(datetime.timezone.utc),
                    error_message=None,
                )
            )
        except Exception as e:
            await listing_parser_service.update_listing_parser(
                session,
                listing_parse.id,
                ListingParserUpdate(
                    status="error",
                    last_finished_at=datetime.datetime.now(datetime.timezone.utc),
                    error_message=str(e)[:250]
                )
            )

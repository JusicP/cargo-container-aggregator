from sqlalchemy.ext.asyncio import AsyncSession

from server.schemas.listing import ListingCreate
from server.scraper.company import Company
import server.services.listing_parser_service as listing_parser_service
import server.services.listing_service as listing_service

async def run_listing_scraper(session: AsyncSession):
    listings_to_parse = await listing_parser_service.get_all_listing_parsers(session)
    listings: list[ListingCreate] = []
    for listing_parse in listings_to_parse:
        company = Company.get_company(listing_parse.method if listing_parse.method else listing_parse.company_name)
        
        listings.extend(company.get_shipping_container_prices(listing_parse))

    # TODO: find a way to update existing listings instead of creating new ones all the time
    await listing_service.create_or_update_listings(session, listings)

    # TODO: update listing parser statistics

import datetime
import logging
from sqlalchemy.ext.asyncio import AsyncSession

from server.schemas.listing import ListingCreate
from server.schemas.listing_parser import ListingParserUpdate
from server.scraper.company import Company
import server.services.listing_parser_service as listing_parser_service
import server.services.listing_service as listing_service
from server.database.connection import async_session_maker 

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.date import DateTrigger
from apscheduler.events import EVENT_JOB_SUBMITTED, EVENT_JOB_EXECUTED, EVENT_JOB_ERROR

logger = logging.getLogger(__name__)

running_jobs = set()


def job_listener(event):
    if event.code == EVENT_JOB_SUBMITTED:
        running_jobs.add(event.job_id)
        logger.info(f"Job {event.job_id} is now RUNNING.")
    elif event.code in (EVENT_JOB_EXECUTED, EVENT_JOB_ERROR):
        if event.job_id in running_jobs:
            running_jobs.remove(event.job_id)
            logger.info(f"Job {event.job_id} has STOPPED.")

def is_job_running(job_id: str):
    return job_id in running_jobs

async def run_listing_scraper_job(scheduler: AsyncIOScheduler):
    job = scheduler.get_job("parser")
    if job:
        return False # job is still running
    
    scheduler.add_job(
        func=run_listing_scraper,
        id="parser",
        trigger=DateTrigger(run_date=datetime.datetime.now())
    )

    return True

async def run_listing_scraper():
    async with async_session_maker() as session:
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

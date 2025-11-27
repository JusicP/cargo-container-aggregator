import asyncio
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from server.scheduler.listing_analytics_job import update_listing_analytics_job
from server.scheduler.listing_parser_job import job_listener
from apscheduler.events import EVENT_JOB_SUBMITTED, EVENT_JOB_EXECUTED, EVENT_JOB_ERROR


def start_scheduler():
    scheduler = AsyncIOScheduler()
    scheduler.add_job(lambda: asyncio.create_task(update_listing_analytics_job()), "cron", hour=0, minute=0)
    scheduler.add_listener(job_listener, EVENT_JOB_SUBMITTED | EVENT_JOB_EXECUTED | EVENT_JOB_ERROR)
    scheduler.start()

    return scheduler

def shutdown_scheduler(scheduler: AsyncIOScheduler):
    scheduler.shutdown()

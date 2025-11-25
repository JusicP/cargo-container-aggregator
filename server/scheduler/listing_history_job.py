# server/jobs/listing_history_job.py

from sqlalchemy import select
from sqlalchemy.orm import selectinload
from server.database.connection import async_session_maker
from server.models.listing import Listing
from server.services.listing_history_service import (
    update_listing_history
)

async def update_listing_history_job():
    async with async_session_maker() as session:
        result = await session.execute(
            select(Listing).options(selectinload(Listing.history))
        )
        listings = result.scalars().all()

        for listing in listings:
            await update_listing_history(session, listing)

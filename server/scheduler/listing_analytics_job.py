import asyncio
from datetime import datetime
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy import select

from server.database.connection import generate_async_session
from server.models.listing_history import ListingHistory
from server.models.listing import Listing
from server.schemas.listing_analytics import ListingAnalyticsGet
from server.services.listing_analytics_service import (
    create_listing_analytics,
    update_listing_analytics,
    get_listing_analytics_by_id
)

async def update_listing_analytics_job():
    async with generate_async_session() as session:
        result = await session.execute(select(Listing))
        listings = result.scalars().all()

        for listing in listings:

            result_history = await session.execute(
                select(ListingHistory).where(ListingHistory.listing_id == listing.id)
            )
            history_entries = result_history.scalars().all()
            if not history_entries:
                continue

            prices = [h.price for h in history_entries if h.price is not None]
            views = sum(h.views for h in history_entries)
            contacts = sum(h.contacts for h in history_entries)
            favorites = sum(h.favorites for h in history_entries)

            if prices:
                avg_price = sum(prices) / len(prices)
                min_price = min(prices)
                max_price = max(prices)
            else:
                avg_price = min_price = max_price = 0.0

            price_trend = {h.addition_date.strftime("%Y-%m-%d"): h.price for h in history_entries}

            analytics_data = ListingAnalyticsGet(
                listing_id=listing.id,
                average_price=avg_price,
                min_price=min_price,
                max_price=max_price,
                price_trend=price_trend,
                views=views,
                contacts=contacts,
                favorites=favorites,
                updated_at=datetime.utcnow(),
            )

            existing_analytics = await get_listing_analytics_by_id(session, listing.id)

            if existing_analytics:
                await update_listing_analytics(session, listing.id, analytics_data)
            else:
                await create_listing_analytics(session, analytics_data)

def start_scheduler():
    scheduler = AsyncIOScheduler()
    scheduler.add_job(lambda: asyncio.create_task(update_listing_analytics_job()), "cron", hour=0, minute=0)
    scheduler.start()

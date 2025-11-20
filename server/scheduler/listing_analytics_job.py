import asyncio
from datetime import datetime
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from server.database.connection import async_session_maker
from server.models.listing_analytics import ListingAnalytics
from server.models.listing import Listing
from server.schemas.listing_analytics import ListingAnalyticsGet
from server.services.listing_analytics_service import (
    create_listing_analytics,
    update_listing_analytics,
)

async def update_listing_analytics_job():
    async with async_session_maker() as session:
        result = await session.execute(
            select(Listing).options(selectinload(Listing.history))
        )
        listings = result.scalars().all()

        for listing in listings:
            history = listing.history
            if not history:
                continue

            prices = [h.price for h in history if h.price is not None]
            views = sum(h.views for h in history)
            contacts = sum(h.contacts for h in history)
            favorites = sum(h.favorites for h in history)

            if prices:
                avg_price = sum(prices) / len(prices)
                min_price = min(prices)
                max_price = max(prices)
            else:
                avg_price = min_price = max_price = 0

            price_trend = {
                h.addition_date.strftime("%Y-%m-%d"): h.price
                for h in history if h.price is not None
            }

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

            existing = await session.scalar(
                select(ListingAnalytics).where(
                    ListingAnalytics.listing_id == listing.id
                )
            )

            if existing:
                await update_listing_analytics(session, listing.id, analytics_data)
            else:
                await create_listing_analytics(session, analytics_data)

def start_scheduler():
    scheduler = AsyncIOScheduler()
    scheduler.add_job(lambda: asyncio.create_task(update_listing_analytics_job()), "cron", hour=0, minute=0)
    scheduler.start()

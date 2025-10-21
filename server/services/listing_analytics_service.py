from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from server.models.listing_analytics import ListingAnalytics
from server.schemas.listing_analytics import ListingAnalyticsGet


async def create_listing_analytics(session: AsyncSession, analytics_get: ListingAnalyticsGet):
    analytics = ListingAnalytics(**analytics_get.model_dump())
    session.add(analytics)
    await session.commit()
    await session.refresh(analytics)
    return analytics


async def get_all_listing_analytics(session: AsyncSession):
    result = await session.execute(select(ListingAnalytics))
    return result.scalars().all()


async def get_listing_analytics_by_id(session: AsyncSession, listing_id: int):
    result = await session.execute(
        select(ListingAnalytics).where(ListingAnalytics.listing_id == listing_id)
    )
    return result.scalar_one_or_none()


async def update_listing_analytics(session: AsyncSession, listing_id: int, analytics_get: ListingAnalyticsGet):
    analytics = await get_listing_analytics_by_id(session, listing_id)
    if not analytics:
        raise ValueError("Listing analytics doesn't exist")

    analytics.average_price = analytics_get.average_price
    analytics.min_price = analytics_get.min_price
    analytics.max_price = analytics_get.max_price
    analytics.price_trend = analytics_get.price_trend
    analytics.views = analytics_get.views
    analytics.contacts = analytics_get.contacts
    analytics.favorites = analytics_get.favorites
    analytics.updated_at = analytics_get.updated_at

    await session.commit()
    await session.refresh(analytics)
    return analytics


async def delete_listing_analytics(session: AsyncSession, listing_id: int):
    analytics = await get_listing_analytics_by_id(session, listing_id)
    if not analytics:
        raise ValueError("Listing analytics doesn't exist")

    await session.delete(analytics)
    await session.commit()

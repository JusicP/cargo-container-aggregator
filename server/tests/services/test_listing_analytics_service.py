import datetime
import pytest

from server.schemas.listing_analytics import ListingAnalyticsGet
from server.services.listing_analytics_service import (
    create_listing_analytics,
    get_all_listing_analytics,
    get_listing_analytics_by_id,
    update_listing_analytics,
    delete_listing_analytics
)


@pytest.mark.asyncio
async def test_create_listing_analytics(session):
    data = ListingAnalyticsGet(
        listing_id=1,
        average_price=100.0,
        min_price=50.0,
        max_price=150.0,
        price_trend={"2025-10-21": 100},
        views=10,
        contacts=5,
        updated_at=datetime.datetime.utcnow()
    )
    
    analytics = await create_listing_analytics(session, data)
    
    assert analytics.listing_id == 1
    assert analytics.average_price == 100.0
    assert analytics.views == 10


@pytest.mark.asyncio
async def test_get_all_listing_analytics(session):
    data1 = ListingAnalyticsGet(
        listing_id=1,
        average_price=100.0,
        min_price=50.0,
        max_price=150.0,
        price_trend={"2025-10-21": 100},
        views=10,
        contacts=5,
        updated_at=datetime.datetime.utcnow()
    )
    data2 = ListingAnalyticsGet(
        listing_id=2,
        average_price=200.0,
        min_price=150.0,
        max_price=250.0,
        price_trend={"2025-10-21": 200},
        views=20,
        contacts=10,
        updated_at=datetime.datetime.utcnow()
    )
    await create_listing_analytics(session, data1)
    await create_listing_analytics(session, data2)
    
    all_analytics = await get_all_listing_analytics(session)
    assert len(all_analytics) == 2


@pytest.mark.asyncio
async def test_get_listing_analytics_by_id(session):
    data = ListingAnalyticsGet(
        listing_id=1,
        average_price=100.0,
        min_price=50.0,
        max_price=150.0,
        price_trend={"2025-10-21": 100},
        views=10,
        contacts=5,
        updated_at=datetime.datetime.utcnow()
    )
    await create_listing_analytics(session, data)
    
    analytics = await get_listing_analytics_by_id(session, 1)
    assert analytics.listing_id == 1
    assert analytics.max_price == 150.0


@pytest.mark.asyncio
async def test_update_listing_analytics(session):
    data = ListingAnalyticsGet(
        listing_id=1,
        average_price=100.0,
        min_price=50.0,
        max_price=150.0,
        price_trend={"2025-10-21": 100},
        views=10,
        contacts=5,
        updated_at=datetime.datetime.utcnow()
    )
    await create_listing_analytics(session, data)
    
    updated_data = ListingAnalyticsGet(
        listing_id=1,
        average_price=120.0,
        min_price=60.0,
        max_price=180.0,
        price_trend={"2025-10-22": 120},
        views=15,
        contacts=7,
        updated_at=datetime.datetime.utcnow()
    )
    
    analytics = await update_listing_analytics(session, 1, updated_data)
    
    assert analytics.average_price == 120.0
    assert analytics.views == 15
    assert analytics.price_trend == {"2025-10-22": 120}


@pytest.mark.asyncio
async def test_delete_listing_analytics(session):
    data = ListingAnalyticsGet(
        listing_id=1,
        average_price=100.0,
        min_price=50.0,
        max_price=150.0,
        price_trend={"2025-10-21": 100},
        views=10,
        contacts=5,
        updated_at=datetime.datetime.utcnow()
    )
    await create_listing_analytics(session, data)
    
    await delete_listing_analytics(session, 1)
    
    analytics = await get_listing_analytics_by_id(session, 1)
    assert analytics is None

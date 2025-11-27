import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from server.models.user import User
from server.schemas.listing import ListingCreate, ListingUpdate
from server.schemas.listing_photo import ListingPhotoCreate
from server.services.listing_service import (
    create_listing,
    get_all_listings,
    get_listing_by_id,
    update_listing,
    delete_listing,
)


@pytest.mark.asyncio
async def test_create_listing(session: AsyncSession):
    user = User(
        name="Test User",
        email="test@example.com",
        phone_number="123456789",
        password="testpass"
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)

    listing_data = ListingCreate(
        title="Test Listing",
        description="Test Description",
        container_type="20ft",
        condition="New",
        type="Sale",
        price=1000.0,
        currency="USD",
        location="Kyiv",
        ral_color="#FFFFFF",
        original_url="http://example.com/listing1",
        photos=[ListingPhotoCreate(photo_id=1, is_main=True)]
    )

    listing = await create_listing(session, user.id, listing_data)
    assert listing.id is not None
    assert listing.user_id == user.id
    assert listing.title == "Test Listing"
    assert listing.status == "pending"


@pytest.mark.asyncio
async def test_get_all_and_by_id(session: AsyncSession):
    user = User(
        name="Getter",
        email="getter@example.com",
        phone_number="987654321",
        password="pass"
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)

    listing_data = ListingCreate(
        title="Fetch Listing",
        description="For fetching",
        container_type="20ft",
        condition="New",
        type="Sale",
        price=500.0,
        currency="USD",
        location="Kyiv",
        ral_color=None,
        original_url=None,
        photos=[]
    )

    await create_listing(session, user.id, listing_data)

    listings = await get_all_listings(session)
    assert isinstance(listings, list)
    if listings:
        listing = listings[0]
        fetched = await get_listing_by_id(session, listing.id)
        assert fetched
        assert fetched.id == listing.id


@pytest.mark.asyncio
async def test_update_listing(session: AsyncSession):
    user = User(
        name="Updater",
        email="updater@example.com",
        phone_number="111222333",
        password="pass"
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)

    listing_data = ListingCreate(
        title="Original Listing",
        description="Original Desc",
        container_type="20ft",
        condition="New",
        type="Sale",
        price=300,
        currency="USD",
        location="Kyiv",
        ral_color=None,
        original_url=None,
        photos=[]
    )
    listing = await create_listing(session, user.id, listing_data)

    update_data = ListingUpdate(
        title="Updated Listing",
        description=listing.description,
        container_type=listing.container_type,
        condition=listing.condition,
        type=listing.type,
        price=listing.last_history.price,
        currency=listing.currency,
        location=listing.location,
        ral_color=listing.ral_color,
        original_url=listing.original_url,
    )

    updated = await update_listing(session, user, listing.id, update_data)
    assert updated.title == "Updated Listing"


@pytest.mark.asyncio
async def test_delete_listing(session: AsyncSession):
    user = User(
        name="Deleter",
        email="deleter@example.com",
        phone_number="444555666",
        password="pass"
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)

    listing_data = ListingCreate(
        title="Delete Listing",
        description="To be deleted",
        container_type="20ft",
        condition="New",
        type="Sale",
        price=200,
        currency="USD",
        location="Kyiv",
        ral_color=None,
        original_url=None,
        photos=[]
    )
    listing = await create_listing(session, user.id, listing_data)

    await delete_listing(session, user, listing.id)
    deleted = await get_listing_by_id(session, listing.id)
    assert deleted is None


@pytest.mark.asyncio
async def test_update_nonexistent_listing(session: AsyncSession):
    user = User(
        name="GhostUser",
        email="ghost@example.com",
        phone_number="000111222",
        password="pass"
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)

    fake_listing_id = 999
    dummy_data = ListingUpdate(
        title="Ghost",
        description="Ghost",
        container_type="20ft",
        condition="New",
        type="Sale",
        price=0,
        currency="USD",
        location="Nowhere",
        ral_color=None,
        original_url=None,
    )

    with pytest.raises(ValueError) as exc_info:
        await update_listing(session, user, fake_listing_id, dummy_data)
    assert str(exc_info.value) == "Listing doesn't exist"

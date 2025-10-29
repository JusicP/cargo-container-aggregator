import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from server.models.user import User
from server.schemas.user import UserCreate
from server.schemas.listing import ListingCreate
from server.schemas.listing_photo import ListingPhotoCreate, ListingPhotoUpdate
from server.services.user_service import create_user
from server.services.listing_service import create_listing
from server.services.listing_photo_service import (
    create_listing_photo,
    get_all_listing_photos,
    get_listing_photo_by_id,
    get_listing_photos_by_listing,
    get_listing_photo_and_check_rights,
    update_listing_photo,
    delete_listing_photo,
)


@pytest.mark.asyncio
async def test_create_and_get_listing_photo(session: AsyncSession):
    user_data = UserCreate(
        name="photo_user",
        password="passphoto",
        email="photo_user@test.com",
        phone_number="1111111111",
        company_name="Photo Company",
    )
    user: User = await create_user(session, user_data)

    listing_data = ListingCreate(
        title="Test Listing",
        description="Desc",
        container_type="20ft",
        condition="New",
        type="Sale",
        price=100,
        currency="USD",
        location="Kyiv",
        ral_color="#fff",
        original_url=None,
        photos=[]
    )
    listing = await create_listing(session, user.id, listing_data)

    photo_data = ListingPhotoCreate(photo_id=1, is_main=True)
    photo = await create_listing_photo(session, user, listing.id, photo_data)

    assert photo.id is not None
    assert photo.listing_id == listing.id
    assert photo.is_main is True

    all_photos = await get_all_listing_photos(session)
    assert len(all_photos) == 1

    photo_by_id = await get_listing_photo_by_id(session, photo.id)
    assert photo_by_id.id == photo.id

    listing_photos = await get_listing_photos_by_listing(session, listing.id)
    assert len(listing_photos) == 1
    assert listing_photos[0].id == photo.id


@pytest.mark.asyncio
async def test_check_rights_update_and_delete_listing_photo(session: AsyncSession):
    user1 = await create_user(session, UserCreate(
        name="user1", password="pass1", email="u1@test.com", phone_number="111", company_name="C1"
    ))
    user2 = await create_user(session, UserCreate(
        name="user2", password="pass2", email="u2@test.com", phone_number="222", company_name="C2"
    ))

    listing_data = ListingCreate(
        title="Listing1",
        description="Desc",
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
    listing = await create_listing(session, user1.id, listing_data)

    photo_data = ListingPhotoCreate(photo_id=1, is_main=True)
    photo = await create_listing_photo(session, user1, listing.id, photo_data)

    checked_photo = await get_listing_photo_and_check_rights(session, user1, photo.id)
    assert checked_photo.id == photo.id

    with pytest.raises(PermissionError):
        await get_listing_photo_and_check_rights(session, user2, photo.id)

    update_data = ListingPhotoUpdate(photo_id=photo.photo_id, is_main=False)
    updated_photo = await update_listing_photo(session, user1, photo.id, update_data)
    assert updated_photo.is_main is False

    await delete_listing_photo(session, user1, photo.id)
    deleted = await get_listing_photo_by_id(session, photo.id)
    assert deleted is None

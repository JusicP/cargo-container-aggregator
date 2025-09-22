from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from server.models.listing import Listing
from server.models.listing_photo import ListingPhoto
from server.models.user import User
from server.schemas.listing_photo import ListingPhotoCreate, ListingPhotoUpdate


async def create_listing_photo(session: AsyncSession, photo_create: ListingPhotoCreate):
    photo = ListingPhoto(**photo_create.model_dump())
    session.add(photo)
    await session.commit()
    await session.refresh(photo)
    return photo


async def create_listing_photos(session: AsyncSession, listing_id: int, photo_ids: list[int]):
    for pid in photo_ids:
        session.add(ListingPhoto(listing_id=listing_id, photo_id=pid, is_main=False)) # FIXME: do something with is_main
    
    await session.commit()


async def get_all_listing_photos(session: AsyncSession):
    result = await session.execute(select(ListingPhoto))
    return result.scalars().all()


async def get_listing_photo_by_id(session: AsyncSession, listing_photo_id: int):
    return await session.get(ListingPhoto, listing_photo_id)


async def get_listing_photos_by_listing(session: AsyncSession, listing_id: int):
    result = await session.execute(
        select(ListingPhoto).where(ListingPhoto.listing_id == listing_id)
    )
    return result.scalars().all()


async def get_listing_photo_main(session: AsyncSession, user_id: int, listing_id: int) -> ListingPhoto | None:
    result = await session.execute(
        select(ListingPhoto)
        .join(Listing, Listing.id == ListingPhoto.listing_id)
        .where(
            ListingPhoto.listing_id == listing_id,
            Listing.user_id == user_id,
            ListingPhoto.is_main == True,
        )
    )
    return result.scalar_one_or_none()


async def get_listing_photo_and_check_rights(session: AsyncSession, user: User, listing_photo_id: int):
    photo = await get_listing_photo_by_id(session, listing_photo_id)
    if not photo:
        raise ValueError("Listing photo doesn't exist")

    listing = await session.get(Listing, photo.listing_id)
    if not listing:
        raise ValueError("Listing doesn't exist")
    
    if not user.is_admin() and listing.user_id != user.id:
        raise PermissionError("You are not allowed to modify photos of this listing") # FIXME: not sure if it's suitable exception type...

    return photo


async def update_listing_photo(session: AsyncSession, user: User, listing_photo_id: int, photo_update: ListingPhotoUpdate):
    photo = await get_listing_photo_and_check_rights(session, user, listing_photo_id)

    if photo_update.is_main:
        photo.is_main = True
        current_main = await get_listing_photo_main(session, user, photo.listing_id)
        if current_main and current_main != photo:
            current_main.is_main = False
    else:
        photo.is_main = False

    await session.commit()
    await session.refresh(photo)

    return photo


async def delete_listing_photo(session: AsyncSession, user: User, listing_photo_id: int):
    photo = await get_listing_photo_and_check_rights(session, user, listing_photo_id)

    await session.delete(photo)
    await session.commit()
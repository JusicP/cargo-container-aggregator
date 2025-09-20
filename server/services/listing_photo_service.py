from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from server.models.listing_photo import ListingPhoto
from server.schemas.listing_photo import ListingPhotoCreate, ListingPhotoGet


async def create_listing_photo(session: AsyncSession, photo_create: ListingPhotoCreate):
    photo = ListingPhoto(**photo_create.model_dump())
    session.add(photo)
    await session.commit()
    await session.refresh(photo)
    return photo


async def create_listing_photos(session: AsyncSession, listing_id: int, photo_ids: list[int]):
    if not photo_ids:
        return
    for pid in photo_ids:
        session.add(ListingPhoto(listing_id=listing_id, photo_id=pid, is_main=False))
    await session.commit()


async def get_all_listing_photos(session: AsyncSession):
    result = await session.execute(select(ListingPhoto))
    return result.scalars().all()


async def get_listing_photo_by_id(session: AsyncSession, photo_id: int):
    return await session.get(ListingPhoto, photo_id)


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
            ListingPhoto.is_main.is_(True),
        )
    )
    return result.scalar_one_or_none()


async def _ensure_can_modify_listing_photo(
    session: AsyncSession,
    actor_user_id: int,
    listing_id: int,
    *,
    is_admin: bool = False,
):
    listing = await session.get(Listing, listing_id)
    if not listing:
        raise ValueError("Listing doesn't exist")
    if not is_admin and listing.user_id != actor_user_id:
        raise PermissionError("You are not allowed to modify photos of this listing")


async def update_listing_photo(
    session: AsyncSession,
    user_id: int,
    photo_id: int,
    photo_update: ListingPhotoUpdate,
    *,
    is_admin: bool = False,
):
    photo = await get_listing_photo_by_id(session, photo_id)
    if not photo:
        raise ValueError("Listing photo doesn't exist")

    await _ensure_can_modify_listing_photo(session, user_id, photo_update.listing_id, is_admin=is_admin)

    if photo_update.is_main:
        photo.is_main = True
        current_main = await get_listing_photo_main(session, user_id, photo_update.listing_id)
        if current_main and current_main != photo:
            current_main.is_main = False
    else:
        photo.is_main = False

    await session.commit()
    await session.refresh(photo)
    return photo


async def delete_listing_photo(
    session: AsyncSession,
    user_id: int,
    photo_id: int,
    *,
    is_admin: bool = False,
):
    photo = await get_listing_photo_by_id(session, photo_id)
    if not photo:
        raise ValueError("Listing photo doesn't exist")

    await _ensure_can_modify_listing_photo(session, user_id, photo.listing_id, is_admin=is_admin)

    await session.delete(photo)
    await session.commit()
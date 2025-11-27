import datetime
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from server.models.notification import UserNotification
from server.schemas.notification import UserNotificationCreate
from server.models.user import User


async def notify_user(
    session: AsyncSession,
    user_id: int,
    data: UserNotificationCreate
):
    notif = UserNotification(
        user_id=user_id,
        type=data.type,
        args=data.args,
        created_at=datetime.datetime.now(datetime.timezone.utc)
    )

    session.add(notif)
    await session.commit()
    await session.refresh(notif)

    return notif


async def get_all_admin_ids(session: AsyncSession) -> list[int]:
    result = await session.execute(
        select(User.id).where(User.role == "admin")
    )
    return [row[0] for row in result.fetchall()]


async def notify_admins(
    session: AsyncSession,
    data: UserNotificationCreate
):
    admin_ids = await get_all_admin_ids(session)

    for admin_id in admin_ids:
        await notify_user(session, admin_id, data)


async def mark_as_read(
    session: AsyncSession,
    user: User,
    ids: list[int]
):
    await session.execute(
        update(UserNotification)
        .where(
            UserNotification.user_id == user.id,
            UserNotification.id.in_(ids)
        )
        .values(
            read_at=datetime.datetime.now(datetime.timezone.utc)
        )
    )
    await session.commit()


async def get_notifications(
    session: AsyncSession,
    user_id: int
):
    result = await session.execute(
        select(UserNotification)
        .where(UserNotification.user_id == user_id)
        .order_by(UserNotification.created_at.desc())
    )
    return result.scalars().all()

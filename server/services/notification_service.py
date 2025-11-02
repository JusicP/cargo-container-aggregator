import datetime
from typing import List, Any, Coroutine, Sequence

from sqlalchemy import select, update, Row, RowMapping
from sqlalchemy.ext.asyncio import AsyncSession

from server.models.notification import UserNotification
from server.models.enums.notification_type import NotificationType
from server.schemas.notification import UserNotificationCreate
from server.models.user import User


async def notify_user(session: AsyncSession, user_id: int, notification_data: UserNotificationCreate):
    notif = UserNotification(
        user_id=user_id,
        type=notification_data.type,
        args=notification_data.args
    )
    session.add(notif)
    await session.commit()
    await session.refresh(notif)
    return notif


async def notify_admins(session: AsyncSession, notification_data: UserNotificationCreate):
    result = await session.execute(select(User).where(User.role == "admin"))
    admins = result.scalars().all()
    for admin in admins:
        await notify_user(session, admin.id, notification_data)


async def notify_all(session: AsyncSession, notification_data: UserNotificationCreate):
    result = await session.execute(select(User))
    users = result.scalars().all()
    for user in users:
        await notify_user(session, user.id, notification_data)


async def get_notifications(session: AsyncSession, user_id: int) -> Sequence[UserNotification]:
    result = await session.execute(
        select(UserNotification)
        .where(UserNotification.user_id == user_id)
        .order_by(UserNotification.created_at.desc())
    )
    return result.scalars().all()


async def mark_as_read(session: AsyncSession, user_id: int, notification_ids: List[int]):
    await session.execute(
        update(UserNotification)
        .where(UserNotification.user_id == user_id, UserNotification.id.in_(notification_ids))
        .values(read_at=datetime.datetime.now(datetime.timezone.utc))
    )
    await session.commit()

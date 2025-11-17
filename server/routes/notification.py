from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError

from server.database.connection import generate_async_session
from server.routes.dependencies import get_current_user
from server.models.user import User
from server.schemas.notification import UserNotificationCreate, UserNotificationGet
from server.services.notification_service import (
    get_notifications,
    mark_as_read,
    notify_user,
    notify_admins,
    notify_all,
)

router = APIRouter(
    prefix="/notifications",
    tags=["notifications"]
)

@router.get("/", response_model=list[UserNotificationGet])
async def notifications_list(
    session: AsyncSession = Depends(generate_async_session),
    current_user: User = Depends(get_current_user()),
):

    try:
        notifications = await get_notifications(session, current_user.id)
        return notifications
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error: {str(e)}"
        )


class MarkReadBody(BaseModel):
    ids: list[int]


@router.post("/read")
async def mark_read_notifications(
    body: MarkReadBody,
    session: AsyncSession = Depends(generate_async_session),
    current_user: User = Depends(get_current_user()),
):

    try:
        if not body.ids:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No notification IDs provided"
            )
        await mark_as_read(session, current_user.id, body.ids)
        return {"status": "ok"}
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error: {str(e)}"
        )

@router.post("/send")
async def send_notification_to_user(
    user_id: int,
    data: UserNotificationCreate,
    session: AsyncSession = Depends(generate_async_session),
    current_user: User = Depends(get_current_user(role="admin")),
):

    try:
        await notify_user(session, user_id, data)
        return {"status": "sent"}
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error: {str(e)}"
        )


@router.post("/send_admins")
async def send_notification_to_admins(
    data: UserNotificationCreate,
    session: AsyncSession = Depends(generate_async_session),
    current_user: User = Depends(get_current_user(role="admin")),
):

    try:
        await notify_admins(session, data)
        return {"status": "sent"}
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error: {str(e)}"
        )


@router.post("/send_all")
async def send_notification_to_all_users(
    data: UserNotificationCreate,
    session: AsyncSession = Depends(generate_async_session),
    current_user: User = Depends(get_current_user(role="admin")),
):

    try:
        await notify_all(session, data)
        return {"status": "sent"}
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error: {str(e)}"
        )

from fastapi import Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from server.auth.utils import decode_token
from server.schemas.listing import ListingFilterParams
from server.services.user_service import get_user_by_id
from server.models.user import User
from server.database.connection import generate_async_session
from server.routes.auth import oauth2_scheme



async def get_current_token_payload(token: str = Depends(oauth2_scheme)) -> dict:
    """
    Extracts JWT from the request, decodes it, and returns the payload
    """
    try:
        payload = decode_token(token)
        return payload
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user(role: str = "user"):
    """
    Factory: returns a dependency function that retrieves the current user
    from the token payload and checks theАir role
    """

    async def dependency(
            payload: dict = Depends(get_current_token_payload),
            session: AsyncSession = Depends(generate_async_session),
    ) -> User:
        user_id: str | None = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload: missing subject",
            )

        user = await get_user_by_id(session, int(user_id))
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )

        # Role check
        if role == "admin" and user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient privileges",
            )

        return user

    return dependency

def get_listing_filters(
    title: str | None = Query(None),
    container_type: list[str] | None = Query(None, alias="container_type[]"),
    condition: list[str] | None = Query(None, alias="condition[]"),
    type_: list[str] | None = Query(None, alias="type[]"),
    price_min: float | None = Query(None),
    price_max: float | None = Query(None),
    currency: str | None = Query(None),
    location: list[str] | None = Query(None, alias="location[]"),
    ral_color: list[str] | None = Query(None, alias="ral_color[]"),
    status: str | None = Query(None),
    sort_by: str | None = Query("addition_date"),
    sort_order: str | None = Query("desc"),
) -> ListingFilterParams:
    params = ListingFilterParams()
    params.title = title
    params.container_type = container_type
    params.condition = condition
    params.type_ = type_
    params.price_min = price_min
    params.price_max = price_max
    params.currency = currency
    params.location = location
    params.ral_color = ral_color
    params.status = status
    params.sort_by = sort_by
    params.sort_order = sort_order
    return params

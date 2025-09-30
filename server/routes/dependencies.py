from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from server.auth.utils import decode_token
from server.services.user_service import get_user_by_id
from server.models.user import User
from server.database.connection import generate_async_session
from auth import oauth2_scheme



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
        if role == "admin" and user.role(user, "role", "user") != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient privileges",
            )

        return user

    return dependency
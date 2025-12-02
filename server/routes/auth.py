# server/auth/routes.py

from datetime import datetime, timezone
import secrets
from typing import Annotated, List

from fastapi.security import OAuth2PasswordRequestForm
from fastapi import APIRouter, Depends, Form, HTTPException, Request, Response, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from server.database.connection import generate_async_session
from server.models.refresh_token import RefreshToken
from server.auth.utils import REFRESH_TOKEN_EXPIRE_DAYS, create_access_token, verify_password
from server.security.oauth2 import OAuth2PasswordBearerWithCookie
from server.services.refresh_token_service import get_refresh_token_from_db, revoke_refresh_token, rotate_refresh_token, create_refresh_token_for_user
from server.services.user_service import get_user_by_email, get_user_by_id

# ==============================
# Router & OAuth2 Scheme
# ==============================
router = APIRouter(prefix="/auth")

# Custom OAuth2 scheme that extracts both access token (from Authorization header)
# and refresh token (from HttpOnly cookie) if no Authorization header
oauth2_scheme = OAuth2PasswordBearerWithCookie(tokenUrl="auth/login")


# ==============================
# Pydantic Schemas
# ==============================
class TokenOut(BaseModel):
    """
    Response schema for any endpoint that issues tokens.
    """
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshTokenOut(BaseModel):
    """
    Admin-viewable schema for refresh tokens in the database.
    """
    id: int
    user_id: int
    issued_at: datetime
    expires_at: datetime
    revoked: bool
    token: str

    class Config:
        orm_mode = True  # allows SQLAlchemy models to be returned directly


# ==============================
# LOGIN ENDPOINT (JSON Login)
# ==============================
@router.post("/login", response_model=TokenOut)
async def login(
    response: Response,
    credentials: OAuth2PasswordRequestForm = Depends(),
    db = Depends(generate_async_session)
):
    """
    Alternative login endpoint that accepts JSON body with email/password.
    This endpoint returns both access and refresh tokens in JSON (refresh token
    not stored in cookie in this version, can be updated to match /token flow).
    """
    user = await get_user_by_email(db, credentials.username)

    if not user or not verify_password(credentials.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    if user.status != "active":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User inactive")

    access_token = create_access_token(user_id=user.id, extra={"role": user.role})
    refresh_token = await create_refresh_token_for_user(db, user)
    
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


# ==============================
# REFRESH ENDPOINT
# ==============================
@router.post("/refresh", response_model=TokenOut)
async def refresh(
    request: Request,
    _: dict = Depends(oauth2_scheme),
    db: AsyncSession = Depends(generate_async_session)
):
    """
    Refresh endpoint that issues a new access token and rotates the refresh token.
    
    - Reads the refresh token from HttpOnly cookie
    - Validates it against the DB
    - Returns new access token in JSON
    - Sets new refresh token in cookie
    """
    refresh_token_in = request.cookies.get("refresh_token")
    if not refresh_token_in:
        raise HTTPException(status_code=401, detail="No refresh token provided")

    # Look up refresh token in DB
    db_refresh_token = await get_refresh_token_from_db(db, refresh_token_in)
    if not db_refresh_token or db_refresh_token.revoked or db_refresh_token.expires_at_aware < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    # Retrieve user associated with the refresh token
    user = await get_user_by_id(db, db_refresh_token.user_id)
    if not user or user.status != "active":
        raise HTTPException(status_code=401, detail="User inactive or blocked")

    # Issue a new access token
    access_token = create_access_token(user_id=user.id, extra={"role": user.role})

    # Rotate refresh token for security
    new_refresh_token_plain = secrets.token_urlsafe(64)
    await rotate_refresh_token(db, refresh_token_in, new_refresh_token_plain)

    # Return new access token and set refresh token cookie
    response = JSONResponse(content={"access_token": access_token, "token_type": "bearer"})
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    )
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token_plain,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=REFRESH_TOKEN_EXPIRE_DAYS*24*60*60
    )
    return response


# ==============================
# LOGOUT ENDPOINT
# ==============================
@router.post("/logout")
async def logout(
    request: Request,
    response: Response,
    _: dict = Depends(oauth2_scheme),
    db: AsyncSession = Depends(generate_async_session)
):
    """
    Logout endpoint revokes the user's refresh token.
    
    - Reads refresh token from HttpOnly cookie
    - Marks the corresponding DB entry as revoked
    - Deletes the cookie from the client
    """
    # revoke refresh token
    refresh_token_in = request.cookies.get("refresh_token")
    if refresh_token_in:
        await revoke_refresh_token(db, refresh_token_in)

    # Remove cookie on client
    response.delete_cookie("refresh_token")
    return {"detail": "Logged out successfully"}


# ==============================
# ADMIN ENDPOINT: List all refresh tokens
# ==============================
@router.get("/refresh-tokens", response_model=List[RefreshTokenOut])
async def list_all_refresh_tokens(
    # Uncomment the following line to enable admin-only access
    # admin: Annotated[User, Depends(get_current_admin)],
    db: Annotated[AsyncSession, Depends(generate_async_session)]
):
    """
    Admin-only endpoint to list all refresh tokens stored in the database.
    
    Useful for monitoring, debugging, or managing tokens.
    """
    result = await db.execute(select(RefreshToken))
    tokens = result.scalars().all()
    return tokens

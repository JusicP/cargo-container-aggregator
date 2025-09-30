# server/auth/routes.py

from datetime import datetime, timedelta
import secrets
from typing import Annotated, List

from fastapi.security import OAuth2PasswordRequestForm
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from server.database.connection import generate_async_session
from server.models.user import User
from server.models.refresh_token import RefreshToken
from server.auth.utils import (
    SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES,
    REFRESH_TOKEN_EXPIRE_DAYS, create_access_token,
    hash_password, verify_password
)
from server.security.oauth2 import OAuth2PasswordBearerWithCookie
from server.services.refresh_token_service import get_refresh_token_from_db
from server.services.user_service import get_user_by_email, get_user_by_id

# ==============================
# Router & OAuth2 Scheme
# ==============================
router = APIRouter(prefix="/auth")

# Custom OAuth2 scheme that extracts both access token (from Authorization header)
# and refresh token (from HttpOnly cookie)
oauth2_scheme = OAuth2PasswordBearerWithCookie(tokenUrl="auth/token")


# ==============================
# Pydantic Schemas
# ==============================
class LoginIn(BaseModel):
    """
    Schema for login endpoint via JSON body.
    """
    email: str
    password: str


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
# TOKEN ENDPOINT (OAuth2 Password Flow)
# ==============================
@router.post("/token")
async def token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Annotated[AsyncSession, Depends(generate_async_session)]
):
    """
    Standard OAuth2 Password Flow endpoint.
    
    Accepts:
        - form_data with 'username' and 'password' fields (username = email)
    
    Returns:
        - access token in JSON response
        - refresh token in HttpOnly cookie (secure, not accessible from frontend JS)
    """
    # Look up user in DB by email
    user = await get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create short-lived access token
    access_token = create_access_token(subject=str(user.id), extra={"role": user.role})

    # Create long-lived refresh token and hash it for storage in DB
    refresh_token_plain = secrets.token_urlsafe(64)
    hashed_refresh_token = hash_password(refresh_token_plain)
    db_token = RefreshToken(
        user_id=user.id,
        token=hashed_refresh_token,
        issued_at=datetime.utcnow(),
        expires_at=datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
        revoked=False
    )
    db.add(db_token)
    await db.commit()

    # Return access token in JSON and refresh token in HttpOnly cookie
    response = JSONResponse(content={"access_token": access_token, "token_type": "bearer"})
    response.set_cookie(
        key="refresh_token",
        value=refresh_token_plain,
        httponly=True,       # prevents JS access
        secure=True,         # enable in production for HTTPS
        samesite="lax",
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    )
    return response


# ==============================
# LOGIN ENDPOINT (JSON Login)
# ==============================
@router.post("/login", response_model=TokenOut)
async def login(
    data: LoginIn,
    db: Annotated[AsyncSession, Depends(generate_async_session)]
):
    """
    Alternative login endpoint that accepts JSON body with email/password.
    This endpoint returns both access and refresh tokens in JSON (refresh token
    not stored in cookie in this version, can be updated to match /token flow).
    """
    # Find user by email
    user = await get_user_by_email(db, data.email)

    # Validate credentials
    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    # Check if the user is active
    if user.status != "active":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User inactive")

    # Generate access token
    access_token = create_access_token(subject=str(user.id), extra={"role": user.role})

    # Generate refresh token and hash for DB
    refresh_token_plain = secrets.token_urlsafe(64)
    hashed_refresh_token = hash_password(refresh_token_plain)
    expires_at = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

    db_token = RefreshToken(
        user_id=user.id,
        token=hashed_refresh_token,
        issued_at=datetime.utcnow(),
        expires_at=expires_at,
        revoked=False
    )
    db.add(db_token)
    await db.commit()

    # Return both tokens in JSON
    return {
        "access_token": access_token,
        "refresh_token": refresh_token_plain,
        "token_type": "bearer"
    }


# ==============================
# REFRESH ENDPOINT
# ==============================
@router.post("/refresh", response_model=TokenOut)
async def refresh(
    tokens: dict = Depends(oauth2_scheme),
    db: AsyncSession = Depends(generate_async_session)
):
    """
    Refresh endpoint that issues a new access token and rotates the refresh token.
    
    - Reads the refresh token from HttpOnly cookie
    - Validates it against the DB
    - Returns new access token in JSON
    - Sets new refresh token in cookie
    """
    refresh_token_in = tokens["refresh_token"]
    if not refresh_token_in:
        raise HTTPException(status_code=401, detail="No refresh token provided")

    # Look up refresh token in DB
    db_token = await get_refresh_token_from_db(db, refresh_token_in)
    if not db_token or db_token.revoked or db_token.expires_at < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    # Retrieve user associated with the refresh token
    user = await get_user_by_id(db, db_token.user_id)
    if not user or user.status != "active":
        raise HTTPException(status_code=401, detail="User inactive or blocked")

    # Issue a new access token
    access_token = create_access_token(subject=str(user.id), extra={"role": user.role})

    # Rotate refresh token for security
    new_refresh_token_plain = secrets.token_urlsafe(64)
    db_token.token = hash_password(new_refresh_token_plain)
    db_token.issued_at = datetime.utcnow()
    db_token.expires_at = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    await db.commit()

    # Return new access token and set refresh token cookie
    response = JSONResponse(content={"access_token": access_token, "token_type": "bearer"})
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token_plain,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=REFRESH_TOKEN_EXPIRE_DAYS*24*60*60
    )
    return response


# ==============================
# LOGOUT ENDPOINT
# ==============================
@router.post("/logout")
async def logout(
    tokens: dict = Depends(oauth2_scheme),
    db: AsyncSession = Depends(generate_async_session)
):
    """
    Logout endpoint revokes the user's refresh token.
    
    - Reads refresh token from HttpOnly cookie
    - Marks the corresponding DB entry as revoked
    - Deletes the cookie from the client
    """
    refresh_token_in = tokens["refresh_token"]
    if refresh_token_in:
        result = await db.execute(select(RefreshToken))
        for t in result.scalars().all():
            if verify_password(refresh_token_in, t.token):
                t.revoked = True
        await db.commit()

    # Remove cookie on client
    response = JSONResponse(content={"detail": "Logged out successfully"})
    response.delete_cookie("refresh_token")
    return response


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

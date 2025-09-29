# server/auth/routes.py
from datetime import datetime, timedelta
import secrets
from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException, status
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from server.database.connection import generate_async_session
from server.models.user import User
from server.models.refresh_token import RefreshToken
from server.auth.utils import (
    SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES,
    REFRESH_TOKEN_EXPIRE_DAYS, create_access_token,
    hash_password, verify_password
)
from pydantic import BaseModel

from server.services.refresh_token_service import get_refresh_token_from_db
from server.services.user_service import get_user_by_email, get_user_by_id

router = APIRouter(prefix="/auth")

# -------------------------------
# Pydantic Schemas
# -------------------------------
class LoginIn(BaseModel):
    email: str
    password: str

class TokenOut(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class RefreshTokenOut(BaseModel):
    id: int
    user_id: int
    issued_at: datetime
    expires_at: datetime
    revoked: bool
    token: str
    class Config:
        orm_mode = True


# ===============================
# LOGIN
# ===============================
@router.post("/login", response_model=TokenOut)
async def login(
    data: LoginIn,
    db: Annotated[AsyncSession, Depends(generate_async_session)]
):
    print(data)
    # Find user by email
    user = await get_user_by_email(db ,data.email)

    # Validate credentials
    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    # Check status
    if user.status != "active":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User inactive")

    # Create short-lived access token
    access_token = create_access_token(subject=str(user.id), extra={"role": user.role})

    # Create long-lived refresh token (store only the hash in DB)
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

    # Return tokens to frontend
    return {"access_token": access_token, "refresh_token": refresh_token_plain, "token_type": "bearer"}


# ===============================
# REFRESH ACCESS TOKEN
# ===============================
@router.post("/refresh", response_model=TokenOut)
async def refresh_token(
    refresh_token_in: str,
    db: Annotated[AsyncSession, Depends(generate_async_session)]
):
    """
    Accepts a refresh token, validates it against the DB,
    and returns a new access + refresh token pair.
    """

    if not refresh_token_in:
        raise HTTPException(status_code=401, detail="No refresh token provided")

    # Search for refresh token in DB
    db_token = await get_refresh_token_from_db(db, refresh_token_in)

    # Validate refresh token
    if not db_token or db_token.revoked or db_token.expires_at < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    # Get the user
    user = await get_user_by_id(db, db_token.user_id)
    if not user or user.status != "active":
        raise HTTPException(status_code=401, detail="User inactive or blocked")

    # Issue new access token
    access_token = create_access_token(subject=str(user.id), extra={"role": user.role})

    # Rotate refresh token (invalidate old one by replacing it)
    new_refresh_token_plain = secrets.token_urlsafe(64)
    db_token.token = hash_password(new_refresh_token_plain)
    db_token.issued_at = datetime.utcnow()
    db_token.expires_at = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    await db.commit()

    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token_plain,
        "token_type": "bearer"
    }


# ===============================
# LOGOUT
# ===============================
@router.post("/logout")
async def logout(
    refresh_token_in: str,
    db: Annotated[AsyncSession, Depends(generate_async_session)]
):
    """
    Logout revokes the given refresh token.
    Access token does not need to be revoked (it will expire soon anyway).
    """

    if refresh_token_in:
        result = await db.execute(select(RefreshToken))
        tokens = result.scalars().all()
        for t in tokens:
            if verify_password(refresh_token_in, t.token):
                t.revoked = True
        await db.commit()

    return {"detail": "Logged out successfully"}


# ===============================
# Dependencies
# ===============================
async def get_current_user(
    token: str,
    db: Annotated[AsyncSession, Depends(generate_async_session)]
) -> User:
    """
    Dependency to extract and validate current user from access token.
    """

    credentials_exception = HTTPException(
        status_code=401, detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str | None = payload.get("sub")
        if not user_id:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    result = await db.execute(select(User).where(User.id == int(user_id)))
    user: User | None = result.scalar_one_or_none()
    if not user or user.status in ("suspended", "blocked"):
        raise HTTPException(status_code=401, detail="User blocked or suspended")
    return user


async def get_current_admin(
    current_user: Annotated[User, Depends(get_current_user)]
) -> User:
    """
    Dependency to check if current user is an admin.
    """
    if not current_user.is_admin():
        raise HTTPException(status_code=403, detail="Admins only")
    return current_user


# ===============================
# Endpoint to list all refresh tokens
# ===============================
@router.get("/refresh-tokens", response_model=List[RefreshTokenOut])
async def list_all_refresh_tokens(
    admin: Annotated[User, Depends(get_current_admin)],
    db: Annotated[AsyncSession, Depends(generate_async_session)]
):
    """
    Admin-only endpoint to list all refresh tokens in the system.
    """
    result = await db.execute(select(RefreshToken))
    tokens = result.scalars().all()
    return tokens

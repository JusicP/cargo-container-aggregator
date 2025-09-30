import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from passlib.context import CryptContext
from server.models.user import User
from server.models.refresh_token import RefreshToken
from server.auth.utils import create_refresh_token, REFRESH_TOKEN_EXPIRE_DAYS, hash_password, verify_password
# Password context for hashing refresh tokens (reuse bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_refresh_token(token: str) -> str:
    """Store only hashed refresh tokens in DB"""
    return pwd_context.hash(token)


async def get_refresh_token_from_db(
    session: AsyncSession,
    refresh_token_in: str
) -> RefreshToken | None:
    """
    Look up a refresh token in the database by comparing hashes.
    Returns the matching RefreshToken object if found, otherwise None.
    """
    result = await session.execute(select(RefreshToken))
    tokens = result.scalars().all()
    for t in tokens:
        if verify_password(refresh_token_in, t.token):
            return t
    return None


# ==========================
# Create a refresh token
# ==========================
async def create_refresh_token_for_user(
    session: AsyncSession,
    user: User,
    expires_delta: datetime.timedelta | None = None
) -> str:
    """
    Generates a new refresh token for a user and stores it hashed in DB.
    Returns the plain token (to send to frontend).
    """
    token = create_refresh_token()
    hashed_token = hash_refresh_token(token)
    now = datetime.datetime.now(datetime.timezone.utc)
    expires_at = now + (expires_delta or datetime.timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS))

    db_token = RefreshToken(
        user_id=user.id,
        token=hashed_token,
        issued_at=now,
        expires_at=expires_at,
        revoked=False,
    )
    session.add(db_token)
    await session.commit()

    return token


# ==========================
# Get refresh token by token string
# ==========================
async def get_refresh_token(
    session: AsyncSession,
    token: str
) -> RefreshToken | None:
    """
    Looks up refresh token by its plain value.
    Returns the DB record if valid (hash matches, not revoked, not expired).
    """
    result = await session.execute(select(RefreshToken))
    all_tokens = result.scalars().all()

    def verify_refresh_token(plain: str, hashed: str) -> bool:
        return pwd_context.verify(plain, hashed)
    
    for db_token in all_tokens:
        if verify_refresh_token(token, db_token.token):
            if db_token.revoked:
                return None
            if db_token.expires_at_aware < datetime.datetime.now(datetime.timezone.utc):
                return None
            return db_token
    return None


# ==========================
# Revoke a refresh token
# ==========================
async def revoke_refresh_token(session: AsyncSession, token: str):
    db_token = await get_refresh_token(session, token)
    if db_token:
        db_token.revoked = True
        await session.commit()


# ==========================
# Revoke all refresh tokens for a user
# ==========================
async def revoke_all_refresh_tokens_for_user(session: AsyncSession, user: User):
    result = await session.execute(select(RefreshToken).where(RefreshToken.user_id == user.id))
    tokens = result.scalars().all()
    for token in tokens:
        token.revoked = True
    await session.commit()

async def rotate_refresh_token(session: AsyncSession, refresh_token: str, new_token: str):
    token = await get_refresh_token(session, refresh_token)
    if not token:
        raise ValueError("No refresh token found")
    
    token.token = hash_password(new_token)
    token.issued_at = datetime.datetime.now(datetime.timezone.utc)
    token.expires_at = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    await session.commit()


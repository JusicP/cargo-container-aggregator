from datetime import datetime, timedelta  # For working with timestamps and token expiration
from passlib.context import CryptContext  # Library for secure password hashing
from jose import jwt, JWTError  # For creating and verifying JSON Web Tokens (JWTs)
from typing import Optional  # For optional function parameters
import secrets  # For generating cryptographically secure random strings

# ==========================
# Configuration Variables
# ==========================

SECRET_KEY = "secret-key"  # Secret key used to sign JWTs;
ALGORITHM = "HS256"  # Algorithm used for JWT signing: HMAC + SHA-256
ACCESS_TOKEN_EXPIRE_MINUTES = 15  # Access tokens are short-lived: 15 minutes by default
REFRESH_TOKEN_EXPIRE_DAYS = 30  # Refresh tokens are long-lived: 30 days by default

# ==========================
# Password Hashing
# ==========================

# Initialize Passlib context with bcrypt as the hashing algorithm
# `deprecated="auto"` ensures old insecure hashes are automatically upgraded if needed
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """
    Hashes a plain-text password using bcrypt.

    Args:
        password (str): Plain-text password input from the user.

    Returns:
        str: Securely hashed password that can be stored in the database.
    """
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    """
    Verifies a plain-text password against a stored hashed password.

    Args:
        plain (str): Password input from the user during login.
        hashed (str): Hashed password retrieved from the database.

    Returns:
        bool: True if passwords match, False otherwise.
    """
    return pwd_context.verify(plain, hashed)

# ==========================
# JWT Access Token Generation
# ==========================

def create_access_token(
    subject: str,  # Typically user ID or email; stored in JWT 'sub' claim
    expires_delta: Optional[timedelta] = None,  # Optional custom expiration duration
    extra: dict = None  # Optional additional claims, e.g., roles or permissions
):
    """
    Creates a signed JWT access token.

    Steps:
        1. Get the current UTC time.
        2. Calculate expiration time (default 15 minutes if not provided).
        3. Build the token payload with standard JWT claims:
            - sub: subject (user identifier)
            - iat: issued at (current time)
            - exp: expiration timestamp
        4. Add extra claims if provided.
        5. Encode the payload using the SECRET_KEY and HS256 algorithm.

    Args:
        subject (str): User identifier for the token.
        expires_delta (Optional[timedelta]): Optional custom expiration.
        extra (dict, optional): Additional payload claims.

    Returns:
        str: Encoded JWT token as a string.
    """
    now = datetime.utcnow()
    expire = now + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    payload = {
        "sub": str(subject),  # User identifier
        "iat": now,           # Issued at timestamp
        "exp": expire         # Expiration timestamp
    }
    if extra:
        payload.update(extra)  # Merge any additional claims into the payload

    # Encode and sign the JWT
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

# ==========================
# Refresh Token Generation
# ==========================

def create_refresh_token() -> str:
    """
    Creates a cryptographically secure refresh token.

    Returns:
        str: URL-safe base64 encoded random string.
    """
    return secrets.token_urlsafe(64)  # Generates 64 bytes of secure random data

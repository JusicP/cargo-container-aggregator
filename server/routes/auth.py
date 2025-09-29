
from fastapi import APIRouter
# from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from fastapi import FastAPI, Depends, HTTPException, status, Response, Cookie
from sqlalchemy.orm import Session
from sqlalchemy import select
from datetime import datetime, timedelta
from server.models.refresh_token import RefreshToken
from server.models.user import User
from server.database.connection import async_session_maker 
from server.auth.utils import hash_password, verify_password, create_access_token, create_refresh_token, REFRESH_TOKEN_EXPIRE_DAYS
from pydantic import BaseModel
from typing import Optional
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError



router = APIRouter(prefix="/auth")

class LoginRequest(BaseModel):
    username_or_email: str
    password: str

@router.post("/login")
async def login(req: LoginRequest):
    if req.username_or_email == "test" and req.password == "123":
        return {"access_token": "fake-jwt-token", "token_type": "bearer"}
    raise HTTPException(status_code=401, detail="Invalid credentials")
    #return {"status": "ok"}







# security = HTTPBearer()  # For Bearer token authentication

# # ------------------------------
# # Pydantic Schemas
# # ------------------------------
# from pydantic import BaseModel

# class LoginIn(BaseModel):
#     """Schema for login input"""
#     identifier: str  # Can be email or username
#     password: str

# class TokenOut(BaseModel):
#     """Schema for token output"""
#     access_token: str
#     token_type: str = "bearer"

# # ------------------------------
# # Login Route
# # ------------------------------
# @router.post("/login", response_model=TokenOut)
# def login(data: LoginIn, response: Response, session: Session = Depends(lambda: Session())):
#     """
#     User login endpoint.
#     - Accepts email or username (identifier) and password.
#     - Verifies credentials.
#     - Creates access and refresh tokens.
#     - Stores refresh token in database and sets it as an HttpOnly cookie.
#     """

#     # Query for user by email OR username
#     user = session.execute(
#         select(User).where((User.email == data.identifier) | (User.name == data.identifier))
#     ).scalar_one_or_none()

#     # Check if user exists and password matches
#     if not user or not verify_password(data.password, user.password):
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

#     # Ensure user is active
#     if user.status != "active":
#         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User inactive")

#     # Generate access token (JWT) and refresh token
#     access_token = create_access_token(subject=str(user.id), extra={"role": user.role})
#     refresh_token = create_refresh_token()
#     expires_at = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

#     # Save refresh token in database
#     rt = RefreshToken(user_id=user.id, token=refresh_token, expires_at=expires_at)
#     session.add(rt)
#     session.commit()

#     # Set refresh token as HttpOnly, secure cookie
#     response.set_cookie(
#         key="refresh_token",
#         value=refresh_token,
#         httponly=True,
#         secure=True,
#         samesite="strict",
#         max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600
#     )

#     return {"access_token": access_token, "token_type": "bearer"}

# # ------------------------------
# # Refresh Access Token Route
# # ------------------------------
# @router.post("/refresh", response_model=TokenOut)
# def refresh(response: Response, refresh_token: Optional[str] = Cookie(None), session: Session = Depends(lambda: Session())):
#     """
#     Refresh access token using a valid refresh token.
#     - Checks if refresh token exists, is not revoked, and is not expired.
#     - Issues a new access token.
#     """

#     if not refresh_token:
#         raise HTTPException(status_code=401, detail="No refresh token provided")

#     rt = session.execute(select(RefreshToken).where(RefreshToken.token == refresh_token)).scalar_one_or_none()
#     if not rt or rt.revoked or rt.expires_at < datetime.utcnow():
#         raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

#     user = session.get(User, rt.user_id)
#     if not user:
#         raise HTTPException(status_code=401, detail="Invalid token user")

#     new_access_token = create_access_token(subject=str(user.id), extra={"role": user.role})
#     return {"access_token": new_access_token, "token_type": "bearer"}

# # ------------------------------
# # Logout Route
# # ------------------------------
# @router.post("/logout")
# def logout(response: Response, refresh_token: Optional[str] = Cookie(None), session: Session = Depends(lambda: Session())):
#     """
#     Logout endpoint.
#     - Revokes refresh token in database.
#     - Deletes refresh token cookie from client.
#     """
#     if refresh_token:
#         rt = session.execute(select(RefreshToken).where(RefreshToken.token == refresh_token)).scalar_one_or_none()
#         if rt:
#             rt.revoked = True
#             session.add(rt)
#             session.commit()
#         response.delete_cookie("refresh_token")
#     return {"ok": True}

# # ------------------------------
# # Protected Route Dependency
# # ------------------------------
# def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), session: Session = Depends(lambda: Session())):
#     """
#     Dependency to retrieve the current authenticated user.
#     - Verifies JWT access token.
#     - Returns User object if valid and active.
#     """
#     token = credentials.credentials
#     try:
#         payload = jwt.decode(token, "super-secret-key-change-in-prod", algorithms=["HS256"])
#         user_id = int(payload.get("sub"))
#     except JWTError:
#         raise HTTPException(status_code=401, detail="Invalid token")

#     user = session.get(User, user_id)
#     if not user or user.status != "active":
#         raise HTTPException(status_code=401, detail="User not found or inactive")
#     return user

# # ------------------------------
# # Example Protected Route
# # ------------------------------
# @router.get("/protected")
# def protected_route(current_user: User = Depends(get_current_user)):
#     """
#     Example of a protected route.
#     Returns information about the currently authenticated user.
#     """
#     return {"hello": current_user.email, "user_id": current_user.id, "role": current_user.role}

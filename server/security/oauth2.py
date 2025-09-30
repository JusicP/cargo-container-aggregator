from typing import Any, cast
from fastapi import HTTPException, Request, status
from fastapi.security import OAuth2
from fastapi.security.utils import get_authorization_scheme_param
from fastapi.openapi.models import OAuthFlows

class OAuth2PasswordBearerWithCookie(OAuth2):
    """
    Retrieve the access token from the Authorization header
    and refresh the token from the "refresh_token" cookie.
    """
    def __init__(
        self,
        tokenUrl: str,
        scheme_name: str | None = None,
        scopes: dict | None = None,
        auto_error: bool = True,
    ):
        if not scopes:
            scopes = {}
        flows = OAuthFlows(password=cast(Any, {"tokenUrl": tokenUrl, "scopes": scopes}))
        super().__init__(flows=flows, scheme_name=scheme_name, auto_error=auto_error)

    async def __call__(self, request: Request) -> dict[str, str | None]:
        # Access token from header
        header_authorization: str | None = request.headers.get("Authorization")
        header_scheme, header_param = get_authorization_scheme_param(header_authorization)
        access_token: str | None = header_param if header_scheme.lower() == "bearer" else None

        # Refresh token from cookie
        refresh_token: str | None = request.cookies.get("refresh_token")

        if not access_token and not refresh_token:
            if self.auto_error:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Not authenticated",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            else:
                return {"access_token": None, "refresh_token": None}

        return {"access_token": access_token, "refresh_token": refresh_token}

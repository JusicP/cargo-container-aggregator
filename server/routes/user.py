from fastapi import APIRouter

from server.schemas.user import UserCreate, UserGet

router = APIRouter(prefix="/register")


@router.post(
    path="/register"
)
async def register(user: UserCreate):
    return {"status": "ok"}

@router.post(
    path="/me",
    response_model=UserGet
)
async def me():
    return {"status": "ok"}
import uuid
from datetime import datetime

from fastapi import APIRouter, Body

from server.schemas.user import UserCreate, UserGet

# router = APIRouter(prefix="/register")
router = APIRouter(prefix="/users", tags=["users"])

@router.get("/")
async def get_users():
    return [
        {
            "id": str(uuid.uuid4()),
            "name": "admin",
            "email": "admin@gmail.com",
            "password": "Admin1234",
            "role": "admin",
            "registration_date": datetime.utcnow().isoformat(),
            "status": "active",
            "phone_number": "+380991112233",
            "company_name": None
        },
        {
            "id": str(uuid.uuid4()),
            "name": "user1",
            "email": "user1@gmail.com",
            "password": "User1234",
            "role": "user",
            "registration_date": datetime.utcnow().isoformat(),
            "status": "active",
            "phone_number": "+380991112234",
            "company_name": "Strawberry",
        }
    ]

@router.get("/me")
async def get_me():
    return {
        "id": str(uuid.uuid4()),
        "name": "user1",
        "email": "user1@gmail.com",
        "password": "User1234",
        "role": "user",
        "registration_date": datetime.utcnow().isoformat(),
        "status": "active",
        "phone_number": "+380991112234",
        "company_name": "Strawberry",
    }

@router.post("/register")
async def register_user(user: dict = Body(...)):
    return {
        "status": "ok",
        "user": {
            "id": str(uuid.uuid4()),
            "name": user.get("name", "NewUser"),
            "email": user.get("email", "new@gmail.com"),
            "password": "NewUser1234",
            "role": "user",
            "registration_date": datetime.utcnow().isoformat(),
            "status": "active",
            "phone_number": user.get("phone_number"),
            "company_name": user.get("company_name")
        }
    }

@router.put("/me")
async def update_user(user: dict = Body(...)):
    return {
        "status": "ok",
        "user":
                {
                    "id": str(uuid.uuid4()),
                    "name": user.get("name", "UpdatedUser"),
                    "email": user.get("email", "updated@test.com"),
                    "password": "User1234",
                    "role": "user",
                    "registration_date": datetime.utcnow().isoformat(),
                    "status": "active",
                    "phone_number": user.get("phone_number"),
                    "company_name": user.get("company_name")
                }
            }

@router.get("/{id}")
async def get_user(id: str):
    return {
        "id": id,
        "name": f"User-{id[:8]}",
        "email": f"user{id[:8]}@gmail.com",
        "password": "User1234",
        "role": "user",
        "registration_date": datetime.utcnow().isoformat(),
        "status": "active",
        "phone_number": "+380994445566",
        "company_name": None
    }

@router.put("/{id}")
async def update_user(id: str, user: dict = Body(...)):
    return {
        "status": "ok",
        "user": {
            "id": id,
            "name": user.get("name", f"User-{id[:8]}"),
            "email": user.get("email", f"user{id[:8]}@gmail.com"),
            "password": "User1234",
            "role": user.get("role", "user"),
            "registration_date": datetime.utcnow().isoformat(),
            "status": user.get("status", "active"),
            "phone_number": user.get("phone_number"),
            "company_name": user.get("company_name")
        }
    }
# @router.post(
#     path="/register"
# )
# async def register(user: UserCreate):
#     return {"status": "ok"}
#
# @router.post(
#     path="/me",
#     response_model=UserGet
# )
# async def me():
#     return {"status": "ok"}
import uuid
from datetime import datetime
from fastapi import APIRouter

from server.schemas.user import UserCreate, UserGet, UserUpdate, UserRole, UserStatus

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=list[UserGet])
async def get_users():
    return [
        {
            "id": uuid.uuid4(),
            "name": "admin",
            "email": "admin@gmail.com",
            "phone_number": "+380991112233",
            "company_name": None,
            "role": UserRole.ADMIN,
            "registration_date": datetime.utcnow(),
            "status": UserStatus.ACTIVE,
        },
        {
            "id": uuid.uuid4(),
            "name": "user1",
            "email": "user1@gmail.com",
            "phone_number": "+380991112234",
            "company_name": "Strawberry",
            "role": UserRole.USER,
            "registration_date": datetime.utcnow(),
            "status": UserStatus.ACTIVE,
        },
    ]


@router.get("/me", response_model=UserGet)
async def get_me():
    return {
        "id": uuid.uuid4(),
        "name": "user1",
        "email": "user1@gmail.com",
        "phone_number": "+380991112234",
        "company_name": "Strawberry",
        "role": UserRole.USER,
        "registration_date": datetime.utcnow(),
        "status": UserStatus.ACTIVE,
    }


@router.post("/register", response_model=UserGet)
async def register_user(user: UserCreate):
    return {
        "id": uuid.uuid4(),
        "name": user.name,
        "email": user.email,
        "phone_number": user.phone_number,
        "company_name": user.company_name,
        "role": UserRole.USER,
        "registration_date": datetime.utcnow(),
        "status": UserStatus.ACTIVE,
    }


@router.put("/me", response_model=UserGet)
async def update_me(user: UserUpdate):
    return {
        "id": uuid.uuid4(),
        "name": user.name,
        "email": user.email,
        "phone_number": user.phone_number,
        "company_name": user.company_name,
        "role": UserRole.USER,
        "registration_date": datetime.utcnow(),
        "status": UserStatus.ACTIVE,
    }


@router.get("/{id}", response_model=UserGet)
async def get_user(id: uuid.UUID):
    return {
        "id": id,
        "name": f"User-{id}",
        "email": f"user{id}@gmail.com",
        "phone_number": "+380994445566",
        "company_name": None,
        "role": UserRole.USER,
        "registration_date": datetime.utcnow(),
        "status": UserStatus.ACTIVE,
    }


@router.put("/{id}", response_model=UserGet)
async def update_user(id: uuid.UUID, user: UserUpdate):
    return {
        "id": id,
        "name": user.name or f"User-{id}",
        "email": user.email or f"user{id}@gmail.com",
        "phone_number": user.phone_number,
        "company_name": user.company_name,
        "role": UserRole.USER,
        "registration_date": datetime.utcnow(),
        "status": UserStatus.ACTIVE,
    }

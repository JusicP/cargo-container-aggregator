from datetime import datetime
from fastapi import APIRouter

<<<<<<< HEAD
from server.schemas.user import UserRegister, UserGet, UserUpdate, UserRole, UserStatus, UserUpdate, UserRole, UserStatus
=======
from server.schemas.user import UserCreate, UserGet, UserUpdate, UserRole, UserStatus, UserUpdate, UserRole, UserStatus
>>>>>>> 7d09c76 (api with fake datas)

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=list[UserGet])
async def get_users():
    return [
        {
            "id": 1,
            "name": "admin",
            "email": "admin@gmail.com",
            "phone_number": "+380991112233",
            "company_name": None,
            "role": UserRole.ADMIN,
            "registration_date": datetime.now(),
            "status": UserStatus.ACTIVE,
            "avatar_photo_id": None,
        },
        {
            "id": 2,
            "name": "user1",
            "email": "user1@gmail.com",
            "phone_number": "+380991112234",
            "company_name": "Strawberry",
            "role": UserRole.USER,
            "registration_date": datetime.now(),
            "status": UserStatus.ACTIVE,
            "avatar_photo_id": None,
        },
    ]


@router.get("/me", response_model=UserGet)
async def get_me():
    return {
        "id": 1,
        "name": "user1",
        "email": "user1@gmail.com",
        "phone_number": "+380991112234",
        "company_name": "Strawberry",
        "role": UserRole.USER,
        "registration_date": datetime.now(),
        "status": UserStatus.ACTIVE,
        "avatar_photo_id": None,
    }


@router.post("/register", response_model=UserGet)
async def register_user(user: UserRegister):
    # TODO: create UserCreate schema object based on current UserRegister object
    return {
        "id": 3,
        "name": user.name,
        "email": user.email,
        "phone_number": user.phone_number,
        "company_name": user.company_name,
        "role": UserRole.USER,
        "registration_date": datetime.now(),
        "status": UserStatus.ACTIVE,
        "avatar_photo_id": None,
    }


@router.put("/me", response_model=UserGet)
async def update_me(user: UserUpdate):
    return {
        "id": 4,
        "name": user.name,
        "email": user.email,
        "phone_number": user.phone_number,
        "company_name": user.company_name,
        "role": UserRole.USER,
        "registration_date": datetime.now(),
        "status": UserStatus.ACTIVE,
        "avatar_photo_id": None,
    }


@router.get("/{id}", response_model=UserGet)
async def get_user(id: int):
    return {
        "id": id,
        "name": f"User-{id}",
        "email": f"user{id}@gmail.com",
        "phone_number": "+380994445566",
        "company_name": None,
        "role": UserRole.USER,
        "registration_date": datetime.now(),
        "status": UserStatus.ACTIVE,
        "avatar_photo_id": None,
    }


@router.put("/{id}", response_model=UserGet)
async def update_user(id: int, user: UserUpdate):
    return {
        "id": id,
        "name": user.name or f"User-{id}",
        "email": user.email or f"user{id}@gmail.com",
        "phone_number": user.phone_number,
        "company_name": user.company_name,
        "avatar_photo_id": user.avatar_photo_id,
        "role": UserRole.USER,
        "registration_date": datetime.now(),
        "status": UserStatus.ACTIVE,
    }

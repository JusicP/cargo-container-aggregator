import os
from server.schemas.user import UserCreate, UserRole
from server.services.user_service import create_user, get_user_by_email
from server.auth.utils import hash_password
async def ensure_superuser(session):
    email = os.getenv("SUPERUSER_EMAIL", "admin@example.com")
    password = os.getenv("SUPERUSER_PASSWORD", "12345678")
    name = os.getenv("SUPERUSER_NAME", "Admin")

    existing_user = await get_user_by_email(session, email)
    if existing_user:
        print(f"Superuser {email} already exists")
        return

    user_create = UserCreate(
        name=name,
        email=email,
        password=password,
        phone_number="0000000000",
        company_name=None,
        avatar_photo_id=None,
        role="admin"
    )

    await create_user(session, user_create)
    print(f"Superuser {email} created")

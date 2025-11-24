from server.schemas.user import UserCreate
from server.services.user_service import create_user, get_user_by_email
from  server.config import email, password, name

async def ensure_superuser(session):
    print("trying to get user")
    existing_user = await get_user_by_email(session, email)
    if existing_user:
        print(f"Superuser {email} already exists")
        return
    print("user do not exist")
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
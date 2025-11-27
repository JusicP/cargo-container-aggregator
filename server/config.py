import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "supersecret")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 30))

DATABASE_URL = os.getenv("DATABASE_URL")
SYNC_DATABASE_URL = os.getenv("SYNC_DATABASE_URL")

FRONTEND_URL = os.getenv("FRONTEND_URL")
FRONTEND_URL_IP = os.getenv("FRONTEND_URL_IP")

email = os.getenv("SUPERUSER_EMAIL", "admin@example.com")
password = os.getenv("SUPERUSER_PASSWORD", "12345678")
name = os.getenv("SUPERUSER_NAME", "Admin")


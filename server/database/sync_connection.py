import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from server.database.base import Base

load_dotenv()

SYNC_DATABASE_URL = os.getenv("SYNC_DATABASE_URL")

if not SYNC_DATABASE_URL:
    raise RuntimeError("SYNC_DATABASE_URL is not set in environment variables")


sync_engine = create_engine(
    SYNC_DATABASE_URL,
    pool_pre_ping=True,
    echo=True,  
)


SyncSessionLocal = sessionmaker(
    bind=sync_engine,
    autocommit=False,
    autoflush=False,
)
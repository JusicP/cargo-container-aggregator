import os
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from dotenv import load_dotenv
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///:memory:")
print("*****************************************")
print(DATABASE_URL)
print("*****************************************")

async_engine = create_async_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}, echo=True
)

async_session_maker = async_sessionmaker(
    bind=async_engine, autocommit=False, autoflush=False
)

from server.database.base import Base

async def generate_async_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency function to yield an async SQLAlchemy ORM session.

    Yields:
        AsyncSession: An instance of an async SQLAlchemy ORM session.
    """
    async with async_session_maker() as async_session:
        yield async_session
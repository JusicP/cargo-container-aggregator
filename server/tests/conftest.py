
import pytest
import pytest_asyncio

from typing import AsyncGenerator
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

from server.main import app
from server.database.connection import generate_async_session
from server.database.base import Base


@pytest_asyncio.fixture(scope="function")
async def session():
    engine = create_async_engine("sqlite+aiosqlite://")
    async with engine.connect() as conn:
        await conn.run_sync(Base.metadata.create_all)

        async_session = AsyncSession(
            conn,
            expire_on_commit=False
        )

        yield async_session

        await async_session.close()
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture()
def test_app(session: AsyncSession) -> FastAPI:
    async def test_generate_async_session() -> AsyncGenerator[AsyncSession, None]:
        yield session
              
    app.dependency_overrides[generate_async_session] = test_generate_async_session

    return app

@pytest.fixture(scope="function")
def client(test_app: FastAPI):
    with TestClient(test_app) as test_client:
        yield test_client

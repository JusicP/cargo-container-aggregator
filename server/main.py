import os
from dotenv import load_dotenv
from fastapi import FastAPI
from contextlib import asynccontextmanager
from typing import AsyncIterator

from server.routes import auth, user, listings, favorites, parserListings, analytics
from server.database.connection import async_engine, async_session_maker
from server.database.base import Base

from server.utils.default_admin import ensure_superuser
from server.database.migrations_runner import run_migrations


load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///:memory:")
SYNC_DATABASE_URL = os.getenv("SYNC_DATABASE_URL")





@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    if "sqlite" not in DATABASE_URL and SYNC_DATABASE_URL:
        run_migrations()
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_maker() as session:
        await ensure_superuser(session)

    yield

app = FastAPI(
    title="Cargo Container Aggregator",
    version="1.0.0",
    lifespan=lifespan,
)

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(listings.router)
app.include_router(favorites.router)
app.include_router(parserListings.router)
app.include_router(analytics.router)
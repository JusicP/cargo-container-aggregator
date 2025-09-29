import logging
from typing import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from server.routes import auth, user, listings, favorites, parserListings, analytics
from server.database.connection import async_engine, Base, async_session_maker
from server.utils.default_admin import ensure_superuser


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_maker() as session:
        await ensure_superuser(session)

    yield


app = FastAPI(
    lifespan=lifespan,
    title="server",
    version="1.0.0",
)


app.include_router(auth.router)
app.include_router(user.router)
app.include_router(listings.router)
app.include_router(favorites.router)
app.include_router(parserListings.router)
app.include_router(analytics.router)

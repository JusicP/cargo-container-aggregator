from contextlib import asynccontextmanager
import logging
from typing import AsyncIterator
from fastapi import FastAPI

from server.routes import auth, user, listings, favorites, parserListings, analytics

logger = logging.getLogger("server")

@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    """
    FastAPI lifespan.
    """
    # TODO: init scheduler (apscheduler), alembic automigration, intial start (inserts initial data, maybe users, to db)
    yield
    # TODO: shutdown scheduler

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

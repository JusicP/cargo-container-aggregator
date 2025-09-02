from contextlib import asynccontextmanager
import logging
from typing import AsyncIterator
from fastapi import FastAPI

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

# TODO: include routers, `app.include_router(...)`
import logging
from typing import AsyncIterator
from contextlib import asynccontextmanager
from time import time

from fastapi import FastAPI, Request
from dotenv import load_dotenv
import os

from server.logger import logger
from server.routes import logs, auth, user, listings, favorites, parserListings, analytics
from server.database.connection import async_engine, Base, async_session_maker
from server.utils.default_admin import ensure_superuser


load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///:memory:")



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


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time()

    try:
        response = await call_next(request)
        process_time = (time() - start_time) * 1000  # milliseconds

        logger.info(
            f"{request.client.host} {request.method} {request.url.path} "
            f"→ {response.status_code} ({process_time:.2f}ms)"
        )

        return response

    except Exception as e:
        logger.error(f"Error processing {request.method} {request.url.path}: {e}")
        raise


app.include_router(auth.router)
app.include_router(user.router)
app.include_router(listings.router)
app.include_router(favorites.router)
app.include_router(parserListings.router)
app.include_router(analytics.router)
app.include_router(logs.router)



@app.on_event("startup")
async def on_startup():
    logger.info("Server started successfully")


@app.on_event("shutdown")
async def on_shutdown():
    logger.info("🛑 Server stopped")

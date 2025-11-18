import os
from dotenv import load_dotenv
from fastapi import FastAPI
from contextlib import asynccontextmanager

from server.routes import auth, user, listings, favorites, parserListings, analytics, user_photo_router, notification
from server.database.connection import async_engine, async_session_maker
from server.database.base import Base
from server.scheduler.listing_analytics_job import start_scheduler

from server.utils.default_admin import ensure_superuser

from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///:memory:")
SYNC_DATABASE_URL = os.getenv("SYNC_DATABASE_URL")


@asynccontextmanager
async def lifespan(app: FastAPI):
    start_scheduler()

    if SYNC_DATABASE_URL:
        print(">>> Running migrations...")
        import asyncio, concurrent.futures
        from server.database.migrations_runner import run_migrations
        loop = asyncio.get_running_loop()
        with concurrent.futures.ThreadPoolExecutor() as pool:
            await loop.run_in_executor(pool, run_migrations)
        print(">>> Migrations done")
    else:
        print(">>> Creating all tables via metadata...")
        async with async_engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print(">>> Tables created")

    async with async_session_maker() as session:
        await ensure_superuser(session)

    yield


app = FastAPI(
    title="Cargo Container Aggregator",
    version="1.0.0",
    lifespan=lifespan,
)

origins = [
    os.getenv("FRONTEND_URL"),
    os.getenv("FRONTEND_URL_IP"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(listings.router)
app.include_router(favorites.router)
app.include_router(parserListings.router)
app.include_router(analytics.router)
app.include_router(user_photo_router.router)
app.include_router(notification.router)

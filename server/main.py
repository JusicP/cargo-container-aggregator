from contextlib import asynccontextmanager
from time import time
from fastapi import FastAPI, Request


from server.logger import logger
from server.routes import auth, user, listings, favorites, parserListings, analytics, user_photo_router, notification, logs
from server.database.connection import async_engine, async_session_maker
from server.database.base import Base
from server.scheduler.mgr import start_scheduler, shutdown_scheduler

from server.utils.default_admin import ensure_superuser

from fastapi.middleware.cors import CORSMiddleware

from server.config import DATABASE_URL, SYNC_DATABASE_URL, FRONTEND_URL,FRONTEND_URL_IP



@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.scheduler = start_scheduler()    

    if "sqlite" not in DATABASE_URL and SYNC_DATABASE_URL:
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

    shutdown_scheduler(app.state.scheduler)


app = FastAPI(
    title="Cargo Container Aggregator",
    version="1.0.0",
    lifespan=lifespan,
)

origins = [
    FRONTEND_URL,
    FRONTEND_URL_IP
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
app.include_router(user_photo_router.router)
app.include_router(notification.router)

from logging.config import fileConfig
import os
from sqlalchemy import pool
from alembic import context
from dotenv import load_dotenv
from server.database.base import Base
from server.database.sync_connection import sync_engine 
import server.models

load_dotenv()

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

DATABASE_URL = os.getenv(
    "SYNC_DATABASE_URL",
    "mysql+pymysql://root:Aa2324252627%2A@localhost:3306/cargo_container_aggregator"
)
config.set_main_option("sqlalchemy.url", DATABASE_URL)


def run_migrations_offline():
    print("Registered tables:", list(target_metadata.tables.keys()))
    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    print("Registered tables:", list(target_metadata.tables.keys()))
    connectable = sync_engine  

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

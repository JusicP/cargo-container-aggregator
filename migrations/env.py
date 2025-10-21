from logging.config import fileConfig
import os
from sqlalchemy import engine_from_config, pool
from alembic import context

from server.database.connection import Base
import server.models

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)


target_metadata = Base.metadata


DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:Aa2324252627%%2A@localhost:3306/cargo_container_aggregator")

config.set_main_option("sqlalchemy.url", DATABASE_URL)


def run_migrations_offline() -> None:
    print("Registered tables:", list(target_metadata.tables.keys()))
    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    print("Registered tables:", list(target_metadata.tables.keys()))
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
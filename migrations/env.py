from logging.config import fileConfig
import os
from sqlalchemy import engine_from_config, pool
from alembic import context

# Import your Base where all models are registered
# Make sure to replace 'myapp.db' with your actual module path
from server.database.connection import Base  

# Alembic Config object, gives access to values from alembic.ini
config = context.config

# Setup Python logging from alembic.ini
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Target metadata for 'autogenerate' migrations
# Without this, Alembic won't detect your models
target_metadata = Base.metadata

# Read DATABASE_URL from environment variable (with SQLite as default fallback)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///:memory:")

# Override sqlalchemy.url in alembic.ini with env var
config.set_main_option("sqlalchemy.url", DATABASE_URL)


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    In this mode, Alembic will not connect to a DB.
    Instead, it generates SQL scripts with bind parameters.
    """
    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this mode, Alembic connects to the actual DB
    and applies migrations directly.
    """
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


# Choose between offline and online migration execution
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

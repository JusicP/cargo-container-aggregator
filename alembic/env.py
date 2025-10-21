from logging.config import fileConfig
import os
from sqlalchemy import pool
from alembic import context
from dotenv import load_dotenv
from server.database.base import Base
from server.database.sync_connection import sync_engine 
import server.models


from sqlalchemy.engine import url as sa_url
import pymysql

def create_database_if_not_exists(database_url: str):
    url_obj = sa_url.make_url(database_url)
    database_name = url_obj.database

    url_without_db = url_obj.set(database=None)
    
    connection = pymysql.connect(
        host=url_obj.host,
        user=url_obj.username,
        password=url_obj.password,
        port=url_obj.port or 3306
    )
    with connection.cursor() as cursor:
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{database_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
    connection.close()


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
    create_database_if_not_exists(DATABASE_URL)
    run_migrations_online()

import os
from alembic import command
from alembic.config import Config
from dotenv import load_dotenv

load_dotenv()

def run_migrations():
    alembic_cfg = Config("alembic.ini")
    alembic_cfg.set_main_option("script_location", "alembic")
    alembic_cfg.set_main_option("sqlalchemy.url", os.getenv("SYNC_DATABASE_URL"))
    command.upgrade(alembic_cfg, "head")
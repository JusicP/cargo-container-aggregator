from server.config import SYNC_DATABASE_URL
from alembic import command
from alembic.config import Config


def run_migrations():
    alembic_cfg = Config("alembic.ini")
    alembic_cfg.set_main_option("script_location", "alembic")
    alembic_cfg.set_main_option("sqlalchemy.url", SYNC_DATABASE_URL)
    command.upgrade(alembic_cfg, "head")
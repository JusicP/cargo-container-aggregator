"""add_user_notifications_table

Revision ID: 5b9dfb4891d2
Revises: 7480ad98b7bc
Create Date: 2025-11-02 22:44:47.131411

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5b9dfb4891d2'
down_revision: Union[str, Sequence[str], None] = '7480ad98b7bc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "user_notifications",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True),
        sa.Column("type", sa.Enum(
            'LISTING_SENT_TO_MODERATION',
            'LISTING_PUBLISHED',
            'LISTING_HAS_ERROR',
            'PARSER_FAILED',
            name="notificationtype"
        ), nullable=False),
        sa.Column("args", sa.JSON, nullable=False),
        sa.Column("read_at", sa.DateTime, nullable=True),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now(), nullable=False)
    )
    pass


def downgrade() -> None:
    op.drop_table("user_notifications")
    op.execute("DROP TYPE IF EXISTS notificationtype")
    pass

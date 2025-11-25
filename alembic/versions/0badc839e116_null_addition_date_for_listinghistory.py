"""null addition date for listinghistory

Revision ID: 0badc839e116
Revises: 5b9dfb4891d2
Create Date: 2025-11-19 13:00:34.526022
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


revision: str = "0badc839e116"
down_revision: Union[str, Sequence[str], None] = "5b9dfb4891d2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = inspect(conn)

    # ---------------------------------
    # listings: drop price if it exists
    # ---------------------------------
    listing_cols = {c["name"] for c in inspector.get_columns("listings")}
    if "price" in listing_cols:
        with op.batch_alter_table("listings") as batch_op:
            batch_op.drop_column("price")

    # ---------------------------------
    # listings_analytics: fix typo
    # ---------------------------------
    analytics_cols = {c["name"] for c in inspector.get_columns("listings_analytics")}

    with op.batch_alter_table("listings_analytics") as batch_op:
        if "favorties" in analytics_cols:
            batch_op.drop_column("favorties")

        if "favorites" not in analytics_cols:
            batch_op.add_column(
                sa.Column(
                    "favorites",
                    sa.Integer(),
                    nullable=False,
                    server_default="0",
                )
            )

    # remove server_default after creation
    op.alter_column(
        "listings_analytics",
        "favorites",
        server_default=None,
    )

    # ---------------------------------------------------------
    # listings_history: allow NULL for addition_date
    # ---------------------------------------------------------
    with op.batch_alter_table("listings_history") as batch_op:
        batch_op.alter_column(
            "addition_date",
            existing_type=sa.DateTime(),
            nullable=True,
        )

    # ---------------------------------------------------------
    # listings_parser: add currency + extend status length
    # ---------------------------------------------------------
    with op.batch_alter_table("listings_parser") as batch_op:
        # batch_op.add_column(
        #     sa.Column(
        #         "currency",
        #         sa.String(length=3),
        #         nullable=False,
        #         server_default="USD",
        #     )
        # )
        batch_op.alter_column(
            "status",
            existing_type=sa.String(length=16),
            type_=sa.String(length=64),
            existing_nullable=False,
        )

    # remove default for currency
    op.alter_column("listings_parser", "currency", server_default=None)


def downgrade() -> None:
    # listings_parser
    with op.batch_alter_table("listings_parser") as batch_op:
        batch_op.alter_column(
            "status",
            existing_type=sa.String(length=64),
            type_=sa.String(length=16),
            existing_nullable=False,
        )
        batch_op.drop_column("currency")

    # listings_history
    with op.batch_alter_table("listings_history") as batch_op:
        batch_op.alter_column(
            "addition_date",
            existing_type=sa.DateTime(),
            nullable=False,
        )

    # listings_analytics
    with op.batch_alter_table("listings_analytics") as batch_op:
        batch_op.drop_column("favorites")
        batch_op.add_column(
            sa.Column("favorties", sa.Integer(), nullable=False)
        )

    # listings: add price back
    with op.batch_alter_table("listings") as batch_op:
        batch_op.add_column(
            sa.Column("price", sa.Float(), nullable=True)
        )

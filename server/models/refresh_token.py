
import datetime
from sqlalchemy import String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from server.database.connection import Base

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id: Mapped[int | None] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    token: Mapped[str] = mapped_column(String(256), unique=True, nullable=False, index=True)
    issued_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    expires_at: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False)
    revoked: Mapped[bool] = mapped_column(Boolean, default=False)

    @property
    def expires_at_aware(self):
        return self.expires_at.replace(tzinfo=datetime.timezone.utc)

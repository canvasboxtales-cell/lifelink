"""Run this script once to create the admin user."""
import asyncio
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.database import Base
from app.models.user import User, UserRole
from app.services.auth_service import get_password_hash
from app.config import settings


async def create_admin():
    if settings.USE_SQLITE:
        db_url = "sqlite+aiosqlite:///./lifelink.db"
    else:
        db_url = settings.DATABASE_URL

    engine = create_async_engine(db_url)
    async_session = async_sessionmaker(engine, class_=AsyncSession)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        admin = User(
            email="admin@lifelink.lk",
            password_hash=get_password_hash("admin123"),
            role=UserRole.admin,
        )
        session.add(admin)
        await session.commit()
        print(f"Admin created: admin@lifelink.lk / admin123")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(create_admin())

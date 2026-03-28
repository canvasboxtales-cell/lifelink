from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker  # type: ignore
from sqlalchemy.orm import DeclarativeBase  # type: ignore
from app.config import settings  # type: ignore

if settings.USE_SQLITE:
    DATABASE_URL = "sqlite+aiosqlite:///./lifelink.db"
    connect_args = {"check_same_thread": False}
else:
    DATABASE_URL = settings.DATABASE_URL
    connect_args = {"ssl": "require"}

kwargs = {
    "echo": False,
    "connect_args": connect_args,
}  # type: ignore

if not settings.USE_SQLITE:
    kwargs["pool_pre_ping"] = True  # type: ignore
    kwargs["pool_recycle"] = 300  # type: ignore
    kwargs["pool_size"] = 10  # type: ignore

engine = create_async_engine(
    DATABASE_URL,
    **kwargs
)

AsyncSessionLocal = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def create_tables():
    async with engine.begin() as conn:
        from app.models import user, request, notification  # type: ignore
        await conn.run_sync(Base.metadata.create_all)

from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://lifelink:password@localhost:5432/lifelink_db"
    SECRET_KEY: str = "change-this-in-production-use-secrets-at-least-32-chars-long"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASS: str = ""
    USE_SQLITE: bool = True  # Set True for local dev without PostgreSQL

    class Config:
        env_file = ".env"

settings = Settings()

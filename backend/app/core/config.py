import os
from typing import List
from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Football Intelligence Platform"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"

    # FastAPI Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # CORS Origins (JSON list or comma separated in env)
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://football-ai.vercel.app"
    ]

    # Database URLs
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/football_ai"
    
    # Vector Database
    CHROMADB_HOST: str = "localhost"
    CHROMADB_PORT: int = 8000
    CHROMADB_COLLECTION_NAME: str = "tactical_knowledge_base"

    # API Keys
    GEMINI_API_KEY: str = ""
    CLERK_API_KEY: str = ""
    CLERK_JWT_KEY: str = ""

    # Storage settings
    STORAGE_TYPE: str = "local"
    UPLOAD_DIR: str = "/app/uploads"

    # Load configuration
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()

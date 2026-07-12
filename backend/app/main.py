from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings


def get_application() -> FastAPI:
    application = FastAPI(
        title=settings.PROJECT_NAME,
        debug=settings.DEBUG,
        version="1.0.0",
        openapi_url=f"{settings.API_V1_STR}/openapi.json" if settings.DEBUG else None,
    )

    # Set up CORS middleware
    if settings.BACKEND_CORS_ORIGINS:
        application.add_middleware(
            CORSMiddleware,
            allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    # Healthcheck Endpoint
    @application.get("/health", tags=["health"])
    def health_check():
        return {
            "status": "healthy",
            "environment": settings.ENVIRONMENT,
            "project": settings.PROJECT_NAME,
        }

    # Register API v1 router
    from app.api.v1.api import api_router
    application.include_router(api_router, prefix=settings.API_V1_STR)

    # Mount static file directory for video playback
    from fastapi.staticfiles import StaticFiles
    import os
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    application.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

    return application


app = get_application()

from fastapi import APIRouter
from app.api.v1.endpoints import matches, analysis

api_router = APIRouter()
api_router.include_router(matches.router, prefix="/matches", tags=["matches"])
api_router.include_router(analysis.router, prefix="/analysis", tags=["analysis"])

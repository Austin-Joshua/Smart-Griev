"""API v1 router"""

from fastapi import APIRouter
from .endpoints import auth, grievances, officers, health

api_router = APIRouter(prefix="/api/v1")

# Include routers
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(grievances.router, prefix="/grievances", tags=["Grievances"])
api_router.include_router(officers.router, prefix="/officers", tags=["Officers"])

__all__ = ["api_router"]

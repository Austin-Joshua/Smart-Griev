"""Health check endpoint"""

from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()


@router.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": settings.app_version,
        "environment": settings.environment
    }


@router.get("/", tags=["Health"])
async def root():
    """Root endpoint"""
    return {
        "app": settings.app_name,
        "version": settings.app_version,
        "message": "Smart Griev API - AI-Powered Grievance Management System"
    }

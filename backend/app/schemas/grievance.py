"""Grievance schemas for request/response validation"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class GrievanceCategory(str, Enum):
    """Grievance categories"""
    WATER_SUPPLY = "water_supply"
    ROAD_MAINTENANCE = "road_maintenance"
    ELECTRICITY = "electricity"
    WASTE_MANAGEMENT = "waste_management"
    PUBLIC_HEALTH = "public_health"
    EDUCATION = "education"
    POLICE = "police"
    MUNICIPAL = "municipal"
    TRANSPORT = "transport"
    ENVIRONMENT = "environment"
    OTHER = "other"


class GrievanceUrgency(str, Enum):
    """Urgency levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class GrievanceStatus(str, Enum):
    """Grievance status"""
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"
    REOPENED = "reopened"


class GrievanceCreate(BaseModel):
    """Schema for creating a grievance"""
    title: str = Field(..., min_length=5, max_length=255)
    description: str = Field(..., min_length=20, max_length=5000)
    category: Optional[GrievanceCategory] = None  # Will be set by AI
    

class GrievanceUpdate(BaseModel):
    """Schema for updating grievance status"""
    status: GrievanceStatus
    comment: Optional[str] = None


class AttachmentInfo(BaseModel):
    """Schema for attachment information"""
    id: str
    file_name: str
    file_size: int
    file_type: str
    file_url: str
    uploaded_by: str
    uploaded_at: datetime


class GrievanceResponse(BaseModel):
    """Schema for grievance response"""
    id: str
    citizen_id: str
    officer_id: Optional[str] = None
    department_id: str
    
    title: str
    description: str
    
    category: GrievanceCategory
    urgency: GrievanceUrgency
    status: GrievanceStatus
    
    is_duplicate: bool
    duplicate_of_id: Optional[str] = None
    similarity_score: Optional[float] = None
    ai_confidence: float
    priority_score: float
    
    assigned_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    attachments: Optional[List[AttachmentInfo]] = []
    
    class Config:
        from_attributes = True


class GrievanceListResponse(BaseModel):
    """Schema for paginated grievance list"""
    items: List[GrievanceResponse]
    total: int
    skip: int
    limit: int


class AIAnalysisResult(BaseModel):
    """Schema for AI analysis results"""
    category: GrievanceCategory
    urgency: GrievanceUrgency
    confidence: float
    is_duplicate: bool
    duplicate_of_id: Optional[str] = None
    similarity_score: Optional[float] = None
    suggested_department_id: str

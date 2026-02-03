"""Grievance model for tracking citizen complaints"""

from sqlalchemy import Column, String, Enum, DateTime, Integer, Float, Text, Boolean, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from enum import Enum as PyEnum

from .base import Base


class GrievanceCategory(PyEnum):
    """Categories of grievances"""
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


class GrievanceUrgency(PyEnum):
    """Urgency levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class GrievanceStatus(PyEnum):
    """Grievance workflow status"""
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"
    REOPENED = "reopened"


class Grievance(Base):
    """
    Grievance model for tracking citizen complaints and requests.
    
    Attributes:
        id: Unique grievance identifier
        citizen_id: ID of citizen who submitted
        officer_id: Assigned officer's ID
        department_id: Department handling the grievance
        title: Short grievance title
        description: Full grievance text
        category: Auto-detected category
        urgency: Detected urgency level
        status: Current workflow status
        is_duplicate: Whether grievance is a duplicate
        duplicate_of_id: Reference to original if duplicate
        similarity_score: Similarity score if duplicate
        ai_confidence: AI model confidence score
        priority_score: Calculated priority for routing
        assigned_at: When grievance was assigned
        resolved_at: Resolution timestamp
        created_at: Submission timestamp
        updated_at: Last modification timestamp
    """
    
    __tablename__ = "grievances"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    citizen_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    officer_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    department_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Content
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    
    # AI Analysis
    category = Column(
        Enum(GrievanceCategory),
        nullable=False,
        index=True
    )
    urgency = Column(
        Enum(GrievanceUrgency),
        nullable=False,
        index=True
    )
    is_duplicate = Column(Boolean, default=False, index=True)
    duplicate_of_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    similarity_score = Column(Float, nullable=True)  # 0.0 - 1.0
    ai_confidence = Column(Float, nullable=False)  # 0.0 - 1.0
    priority_score = Column(Float, nullable=False, default=0.5)  # 0.0 - 1.0
    
    # Status tracking
    status = Column(
        Enum(GrievanceStatus),
        nullable=False,
        default=GrievanceStatus.SUBMITTED,
        index=True
    )
    
    # Timeline
    assigned_at = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Indexes for common queries
    __table_args__ = (
        Index('idx_citizen_status', 'citizen_id', 'status'),
        Index('idx_officer_status', 'officer_id', 'status'),
        Index('idx_department_status', 'department_id', 'status'),
        Index('idx_created_date', 'created_at'),
    )
    
    def __repr__(self) -> str:
        return f"<Grievance(id={self.id}, category={self.category}, status={self.status})>"

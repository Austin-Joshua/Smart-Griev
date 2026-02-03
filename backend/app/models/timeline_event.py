"""Timeline event model for tracking grievance workflow history"""

from sqlalchemy import Column, String, Enum, DateTime, Text, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from enum import Enum as PyEnum

from .base import Base


class EventType(PyEnum):
    """Types of timeline events"""
    SUBMITTED = "submitted"
    ASSIGNED = "assigned"
    STATUS_UPDATED = "status_updated"
    COMMENT_ADDED = "comment_added"
    ATTACHMENT_ADDED = "attachment_added"
    ESCALATED = "escalated"
    RESOLVED = "resolved"
    REOPENED = "reopened"
    CLOSED = "closed"


class TimelineEvent(Base):
    """
    Timeline event model for tracking all changes to a grievance.
    
    Attributes:
        id: Unique event identifier
        grievance_id: Associated grievance ID
        event_type: Type of event
        actor_id: User who triggered the event
        actor_role: Role of the actor
        description: Event description
        comment: Optional comment text
        metadata: Additional event data (JSON)
        is_visible_to_citizen: Whether citizen can see this event
        created_at: Event timestamp
    """
    
    __tablename__ = "timeline_events"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    grievance_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    event_type = Column(Enum(EventType), nullable=False, index=True)
    actor_id = Column(UUID(as_uuid=True), nullable=False)
    actor_role = Column(String(50), nullable=False)  # citizen, officer, admin, system
    
    description = Column(String(255), nullable=False)
    comment = Column(Text, nullable=True)
    metadata = Column(Text, nullable=True)  # JSON string for extensibility
    
    is_visible_to_citizen = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    # Index for efficient timeline queries
    __table_args__ = (
        Index('idx_grievance_created', 'grievance_id', 'created_at'),
    )
    
    def __repr__(self) -> str:
        return f"<TimelineEvent(id={self.id}, grievance_id={self.grievance_id}, type={self.event_type})>"

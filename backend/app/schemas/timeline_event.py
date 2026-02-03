"""Timeline event schemas"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum


class EventType(str, Enum):
    """Event types"""
    SUBMITTED = "submitted"
    ASSIGNED = "assigned"
    STATUS_UPDATED = "status_updated"
    COMMENT_ADDED = "comment_added"
    ATTACHMENT_ADDED = "attachment_added"
    ESCALATED = "escalated"
    RESOLVED = "resolved"
    REOPENED = "reopened"
    CLOSED = "closed"


class TimelineEventCreate(BaseModel):
    """Schema for creating timeline event"""
    event_type: EventType
    description: str
    comment: Optional[str] = None
    is_visible_to_citizen: bool = True


class TimelineEventResponse(BaseModel):
    """Schema for timeline event response"""
    id: str
    grievance_id: str
    event_type: EventType
    actor_id: str
    actor_role: str
    description: str
    comment: Optional[str] = None
    is_visible_to_citizen: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class GrievanceTimelineResponse(BaseModel):
    """Schema for full grievance timeline"""
    grievance_id: str
    events: list[TimelineEventResponse]
    total_events: int

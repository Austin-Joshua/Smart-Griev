"""Attachment schemas"""

from pydantic import BaseModel
from datetime import datetime


class AttachmentCreate(BaseModel):
    """Schema for creating attachment"""
    file_name: str
    file_size: int
    file_type: str


class AttachmentResponse(BaseModel):
    """Schema for attachment response"""
    id: str
    grievance_id: str
    file_name: str
    file_size: int
    file_type: str
    file_url: str
    uploaded_by: str
    uploaded_at: datetime
    
    class Config:
        from_attributes = True

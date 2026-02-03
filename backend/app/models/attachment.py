"""Attachment model for storing grievance files"""

from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

from .base import Base


class Attachment(Base):
    """
    Attachment model for files related to grievances.
    
    Attributes:
        id: Unique attachment identifier
        grievance_id: Associated grievance ID
        file_name: Original file name
        file_size: File size in bytes
        file_type: MIME type
        file_url: Cloud storage URL
        uploaded_by: User ID who uploaded
        uploaded_at: Upload timestamp
    """
    
    __tablename__ = "attachments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    grievance_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    file_name = Column(String(255), nullable=False)
    file_size = Column(Integer, nullable=False)  # in bytes
    file_type = Column(String(100), nullable=False)  # MIME type
    file_url = Column(String(500), nullable=False)
    
    uploaded_by = Column(UUID(as_uuid=True), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    def __repr__(self) -> str:
        return f"<Attachment(id={self.id}, grievance_id={self.grievance_id}, file={self.file_name})>"

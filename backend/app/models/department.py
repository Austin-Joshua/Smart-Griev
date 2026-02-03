"""Department model for organizing grievance handling"""

from sqlalchemy import Column, String, Text, DateTime, Integer
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

from .base import Base


class Department(Base):
    """
    Department model representing government departments handling grievances.
    
    Attributes:
        id: Unique department identifier
        name: Department name
        code: Short department code
        description: Department description
        email: Contact email
        phone: Contact phone
        categories: Comma-separated grievance categories handled
        max_capacity: Maximum grievances that can be assigned
        current_load: Current number of assigned grievances
        avg_resolution_time: Average resolution time in hours
        created_at: Creation timestamp
        updated_at: Last update timestamp
    """
    
    __tablename__ = "departments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    name = Column(String(255), nullable=False, unique=True)
    code = Column(String(50), nullable=False, unique=True, index=True)
    description = Column(Text, nullable=True)
    
    # Contact information
    email = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    
    # Category mapping (comma-separated)
    categories = Column(Text, nullable=False)  # e.g., "water_supply,electricity"
    
    # Load management
    max_capacity = Column(Integer, default=100)
    current_load = Column(Integer, default=0)
    avg_resolution_time = Column(Integer, default=48)  # hours
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self) -> str:
        return f"<Department(id={self.id}, name={self.name}, code={self.code})>"

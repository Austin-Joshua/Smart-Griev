"""User model for authentication and authorization"""

from sqlalchemy import Column, String, Enum, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from enum import Enum as PyEnum

from .base import Base


class UserRole(PyEnum):
    """User roles in the system"""
    CITIZEN = "citizen"
    OFFICER = "officer"
    ADMIN = "admin"


class User(Base):
    """
    User model representing citizens, officers, and admins.
    
    Attributes:
        id: Unique user identifier (UUID)
        email: User email (unique)
        password_hash: Hashed password
        full_name: User's full name
        role: User's role (citizen, officer, admin)
        phone: Phone number
        department_id: Department assignment (for officers)
        is_active: Account status
        is_verified: Email verification status
        created_at: Account creation timestamp
        updated_at: Last update timestamp
    """
    
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(
        Enum(UserRole),
        nullable=False,
        default=UserRole.CITIZEN,
        index=True
    )
    phone = Column(String(20), nullable=True)
    department_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    is_active = Column(Boolean, default=True, index=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"

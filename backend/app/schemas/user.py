"""User schemas for request/response validation"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    """User roles"""
    CITIZEN = "citizen"
    OFFICER = "officer"
    ADMIN = "admin"


class UserCreate(BaseModel):
    """Schema for user registration"""
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str = Field(..., min_length=2, max_length=255)
    phone: Optional[str] = None
    role: UserRole = UserRole.CITIZEN


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """Schema for user response"""
    id: str
    email: str
    full_name: str
    role: UserRole
    phone: Optional[str] = None
    department_id: Optional[str] = None
    is_active: bool
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """Schema for token response"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenRequest(BaseModel):
    """Schema for token refresh request"""
    refresh_token: str


class PasswordChange(BaseModel):
    """Schema for password change"""
    old_password: str
    new_password: str = Field(..., min_length=8)

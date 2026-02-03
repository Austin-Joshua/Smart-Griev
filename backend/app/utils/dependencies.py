"""FastAPI dependencies for authentication and authorization"""

from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthCredentials
from app.core.security import verify_token
from app.core.logging import get_logger
from app.db.session import get_db
from app.models.user import User, UserRole
from sqlalchemy.orm import Session

logger = get_logger(__name__)
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Get current authenticated user from JWT token.
    
    Usage:
        @app.get("/me")
        async def get_me(current_user: User = Depends(get_current_user)):
            return current_user
    """
    token = credentials.credentials
    
    # Verify token
    payload = verify_token(token, token_type="access")
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("sub")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token claims",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user from database
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user",
        )
    
    return user


class RoleChecker:
    """Dependency for checking user roles"""
    
    def __init__(self, allowed_roles: list):
        """
        Initialize role checker.
        
        Args:
            allowed_roles: List of allowed roles
        """
        self.allowed_roles = allowed_roles
    
    async def __call__(
        self,
        current_user: User = Depends(get_current_user)
    ) -> User:
        """
        Check if user has allowed role.
        
        Usage:
            @app.get("/admin")
            async def admin_only(
                current_user: User = Depends(RoleChecker([UserRole.ADMIN]))
            ):
                return current_user
        """
        if current_user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"User role {current_user.role} not authorized"
            )
        return current_user


def get_citizen_checker():
    """Role checker for citizens"""
    return RoleChecker([UserRole.CITIZEN])


def get_officer_checker():
    """Role checker for officers"""
    return RoleChecker([UserRole.OFFICER, UserRole.ADMIN])


def get_admin_checker():
    """Role checker for admins"""
    return RoleChecker([UserRole.ADMIN])

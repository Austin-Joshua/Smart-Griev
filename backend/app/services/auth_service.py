"""Authentication and authorization service"""

from typing import Optional, Tuple
from sqlalchemy.orm import Session
from app.core.security import (
    get_password_hash, verify_password, create_access_token, verify_token
)
from app.core.logging import get_logger
from app.models.user import User, UserRole
from app.schemas.user import UserCreate, TokenResponse

logger = get_logger(__name__)


class AuthService:
    """Service for authentication and authorization"""
    
    @staticmethod
    def register_user(
        db: Session,
        user_data: UserCreate
    ) -> Tuple[bool, str, Optional[User]]:
        """
        Register a new user.
        
        Args:
            db: Database session
            user_data: User registration data
            
        Returns:
            Tuple of (success, message, user)
        """
        # Check if user already exists
        existing_user = db.query(User).filter(
            User.email == user_data.email
        ).first()
        
        if existing_user:
            logger.warning(f"Registration failed: email {user_data.email} already exists")
            return False, "Email already registered", None
        
        # Create new user
        try:
            new_user = User(
                email=user_data.email,
                password_hash=get_password_hash(user_data.password),
                full_name=user_data.full_name,
                role=UserRole(user_data.role.value) if hasattr(user_data.role, 'value') else user_data.role,
                phone=user_data.phone,
                is_active=True,
                is_verified=False  # Email verification required in production
            )
            
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            
            logger.info(f"User registered successfully: {user_data.email}")
            return True, "User registered successfully", new_user
            
        except Exception as e:
            db.rollback()
            logger.error(f"Error registering user: {e}")
            return False, f"Registration failed: {str(e)}", None
    
    @staticmethod
    def authenticate_user(
        db: Session,
        email: str,
        password: str
    ) -> Tuple[bool, str, Optional[User]]:
        """
        Authenticate user and return user object.
        
        Args:
            db: Database session
            email: User email
            password: User password
            
        Returns:
            Tuple of (success, message, user)
        """
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            logger.warning(f"Authentication failed: user {email} not found")
            return False, "Invalid credentials", None
        
        if not user.is_active:
            logger.warning(f"Authentication failed: user {email} is inactive")
            return False, "Account is inactive", None
        
        if not verify_password(password, user.password_hash):
            logger.warning(f"Authentication failed: invalid password for {email}")
            return False, "Invalid credentials", None
        
        logger.info(f"User authenticated successfully: {email}")
        return True, "Authentication successful", user
    
    @staticmethod
    def generate_tokens(
        user_id: str,
        role: str,
        email: str
    ) -> TokenResponse:
        """
        Generate access and refresh tokens for user.
        
        Args:
            user_id: User ID
            role: User role
            email: User email
            
        Returns:
            Token response with access and refresh tokens
        """
        # Create access token
        access_token = create_access_token(
            data={
                "sub": user_id,
                "role": role,
                "email": email
            },
            token_type="access"
        )
        
        # Create refresh token
        refresh_token = create_access_token(
            data={
                "sub": user_id,
                "role": role,
                "email": email
            },
            token_type="refresh"
        )
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=30 * 60  # 30 minutes in seconds
        )
    
    @staticmethod
    def refresh_access_token(
        refresh_token: str
    ) -> Tuple[bool, str, Optional[str]]:
        """
        Generate new access token from refresh token.
        
        Args:
            refresh_token: Refresh token
            
        Returns:
            Tuple of (success, message, new_access_token)
        """
        # Verify refresh token
        payload = verify_token(refresh_token, token_type="refresh")
        
        if not payload:
            logger.warning("Invalid refresh token")
            return False, "Invalid refresh token", None
        
        # Create new access token
        new_access_token = create_access_token(
            data={
                "sub": payload["sub"],
                "role": payload["role"],
                "email": payload["email"]
            },
            token_type="access"
        )
        
        logger.info(f"Access token refreshed for user {payload['sub']}")
        return True, "Token refreshed", new_access_token
    
    @staticmethod
    def verify_user_token(
        token: str
    ) -> Tuple[bool, str, Optional[dict]]:
        """
        Verify user token and return claims.
        
        Args:
            token: Access token
            
        Returns:
            Tuple of (success, message, claims)
        """
        payload = verify_token(token, token_type="access")
        
        if not payload:
            return False, "Invalid or expired token", None
        
        return True, "Token valid", payload
    
    @staticmethod
    def change_password(
        db: Session,
        user_id: str,
        old_password: str,
        new_password: str
    ) -> Tuple[bool, str]:
        """
        Change user password.
        
        Args:
            db: Database session
            user_id: User ID
            old_password: Current password
            new_password: New password
            
        Returns:
            Tuple of (success, message)
        """
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            return False, "User not found"
        
        if not verify_password(old_password, user.password_hash):
            return False, "Current password is incorrect"
        
        try:
            user.password_hash = get_password_hash(new_password)
            db.commit()
            logger.info(f"Password changed for user {user_id}")
            return True, "Password changed successfully"
        except Exception as e:
            db.rollback()
            logger.error(f"Error changing password: {e}")
            return False, f"Error changing password: {str(e)}"

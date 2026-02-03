"""Authentication endpoints"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.user import UserCreate, UserLogin, TokenResponse, PasswordChange, UserResponse
from app.services.auth_service import AuthService
from app.utils.dependencies import get_current_user
from app.models.user import User
from app.core.logging import get_logger

logger = get_logger(__name__)
router = APIRouter()


@router.post("/register", response_model=UserResponse)
async def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Register a new user.
    
    - **email**: User email (must be unique)
    - **password**: Password (minimum 8 characters)
    - **full_name**: Full name
    - **phone**: Optional phone number
    - **role**: User role (citizen, officer, admin)
    """
    success, message, user = AuthService.register_user(db, user_data)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    
    logger.info(f"User registered: {user.email}")
    return user


@router.post("/login", response_model=TokenResponse)
async def login(
    credentials: UserLogin,
    db: Session = Depends(get_db)
):
    """
    Login user and get tokens.
    
    Returns access and refresh tokens for authenticated user.
    """
    success, message, user = AuthService.authenticate_user(
        db, credentials.email, credentials.password
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=message
        )
    
    # Generate tokens
    tokens = AuthService.generate_tokens(
        user_id=str(user.id),
        role=user.role.value,
        email=user.email
    )
    
    logger.info(f"User logged in: {user.email}")
    return tokens


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(refresh_token: str):
    """
    Refresh access token using refresh token.
    """
    success, message, new_token = AuthService.refresh_access_token(refresh_token)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=message
        )
    
    return TokenResponse(
        access_token=new_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=30 * 60
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """
    Get current user information.
    """
    return current_user


@router.post("/change-password")
async def change_password(
    password_data: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Change user password.
    """
    success, message = AuthService.change_password(
        db,
        str(current_user.id),
        password_data.old_password,
        password_data.new_password
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    
    return {"message": "Password changed successfully"}

"""Officer workflow endpoints"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.grievance import Grievance, GrievanceStatus
from app.schemas.grievance import GrievanceResponse, GrievanceListResponse
from app.services.grievance_service import GrievanceService
from app.utils.dependencies import get_current_user
from app.core.logging import get_logger

logger = get_logger(__name__)
router = APIRouter()


@router.get("/me/assigned", response_model=GrievanceListResponse)
async def get_assigned_grievances(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status_filter: Optional[str] = None,
    urgency_filter: Optional[str] = None,
    sort_by: str = Query("priority", regex="^(priority|created|urgency)$")
):
    """
    Get grievances assigned to current officer.
    
    **Filters:**
    - `status_filter`: Filter by status (submitted, under_review, in_progress, resolved, closed)
    - `urgency_filter`: Filter by urgency (low, medium, high, critical)
    - `sort_by`: Sort by priority (default), created date, or urgency
    """
    # Only officers and admins can access
    if current_user.role not in [UserRole.OFFICER, UserRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only officers can access assigned grievances"
        )
    
    # Parse filters
    status_enum = None
    if status_filter:
        try:
            status_enum = GrievanceStatus(status_filter)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status: {status_filter}"
            )
    
    urgency_enum = None
    if urgency_filter:
        from app.models.grievance import GrievanceUrgency
        try:
            urgency_enum = GrievanceUrgency(urgency_filter)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid urgency: {urgency_filter}"
            )
    
    # Get grievances
    grievances, total = GrievanceService.get_officer_grievances(
        db,
        str(current_user.id),
        skip,
        limit,
        status_enum,
        urgency_enum
    )
    
    return GrievanceListResponse(
        items=[GrievanceResponse.from_orm(g) for g in grievances],
        total=total,
        skip=skip,
        limit=limit
    )


@router.post("/{grievance_id}/accept")
async def accept_grievance(
    grievance_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Officer accepts grievance (mark as under review).
    """
    # Only officers can accept
    if current_user.role not in [UserRole.OFFICER, UserRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only officers can accept grievances"
        )
    
    grievance = GrievanceService.get_grievance(db, grievance_id)
    
    if not grievance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Grievance not found"
        )
    
    # Check if already assigned to this officer
    if grievance.officer_id and grievance.officer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Grievance already assigned to another officer"
        )
    
    # Assign if not already assigned
    if not grievance.officer_id:
        success = GrievanceService.assign_officer(db, grievance_id, str(current_user.id))
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to assign grievance"
            )
    else:
        # Update status if already assigned
        success = GrievanceService.update_grievance_status(
            db,
            grievance_id,
            GrievanceStatus.UNDER_REVIEW,
            str(current_user.id),
            "officer",
            "Grievance accepted for review"
        )
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update grievance status"
            )
    
    return {
        "success": True,
        "message": "Grievance accepted",
        "grievance_id": grievance_id
    }


@router.post("/{grievance_id}/mark-in-progress")
async def mark_in_progress(
    grievance_id: str,
    comment: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mark grievance as in progress.
    """
    if current_user.role not in [UserRole.OFFICER, UserRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only officers can mark as in progress"
        )
    
    grievance = GrievanceService.get_grievance(db, grievance_id)
    
    if not grievance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Grievance not found"
        )
    
    if current_user.role == UserRole.OFFICER and grievance.officer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not assigned to you"
        )
    
    success = GrievanceService.update_grievance_status(
        db,
        grievance_id,
        GrievanceStatus.IN_PROGRESS,
        str(current_user.id),
        "officer",
        comment or "Work started on this grievance"
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update status"
        )
    
    return {
        "success": True,
        "message": "Grievance marked as in progress"
    }


@router.post("/{grievance_id}/resolve")
async def resolve_grievance(
    grievance_id: str,
    resolution_details: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mark grievance as resolved with details.
    """
    if current_user.role not in [UserRole.OFFICER, UserRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only officers can resolve grievances"
        )
    
    grievance = GrievanceService.get_grievance(db, grievance_id)
    
    if not grievance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Grievance not found"
        )
    
    if current_user.role == UserRole.OFFICER and grievance.officer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not assigned to you"
        )
    
    success = GrievanceService.update_grievance_status(
        db,
        grievance_id,
        GrievanceStatus.RESOLVED,
        str(current_user.id),
        "officer",
        f"Resolution: {resolution_details}"
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to resolve grievance"
        )
    
    # Send notification to citizen
    from app.models.user import User as UserModel
    from app.services.notification_service import NotificationService
    
    citizen = db.query(UserModel).filter(UserModel.id == grievance.citizen_id).first()
    
    if citizen:
        department = db.query(Grievance.__table__.c.department_id).filter(
            Grievance.id == grievance.id
        ).first()
        
        NotificationService.notify_grievance_resolved(
            recipient_email=citizen.email,
            citizen_name=citizen.full_name,
            grievance_id=grievance_id,
            department_name="Department",  # Should fetch from DB
            resolution_details=resolution_details
        )
    
    return {
        "success": True,
        "message": "Grievance resolved",
        "grievance_id": grievance_id
    }


@router.get("/{grievance_id}/escalation-check")
async def check_escalation(
    grievance_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Check if grievance needs escalation based on time.
    """
    from datetime import datetime, timedelta
    from app.core.config import settings
    
    if current_user.role not in [UserRole.OFFICER, UserRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    grievance = GrievanceService.get_grievance(db, grievance_id)
    
    if not grievance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Grievance not found"
        )
    
    # Check if grievance is overdue
    time_elapsed = datetime.utcnow() - grievance.created_at
    escalation_threshold = timedelta(hours=settings.escalation_time_hours)
    
    needs_escalation = time_elapsed > escalation_threshold
    
    return {
        "grievance_id": grievance_id,
        "needs_escalation": needs_escalation,
        "time_elapsed_hours": time_elapsed.total_seconds() / 3600,
        "escalation_threshold_hours": settings.escalation_time_hours,
        "status": grievance.status.value
    }

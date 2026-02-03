"""Grievance management endpoints"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User, UserRole
from app.schemas.grievance import (
    GrievanceCreate, GrievanceResponse, GrievanceListResponse, GrievanceUpdate
)
from app.schemas.timeline_event import TimelineEventResponse, GrievanceTimelineResponse
from app.services.grievance_service import GrievanceService
from app.services.ai_service import AIService
from app.services.routing_service import RoutingService
from app.services.notification_service import NotificationService
from app.utils.dependencies import get_current_user
from app.core.logging import get_logger

logger = get_logger(__name__)
router = APIRouter()

# Initialize services
ai_service = AIService()


@router.post("/submit", response_model=dict)
async def submit_grievance(
    grievance_data: GrievanceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Submit a new grievance.
    
    **Workflow:**
    1. Validate input
    2. Run AI analysis
    3. Check for duplicates
    4. Route to department
    5. Create grievance record
    6. Send notification
    
    Returns grievance ID and initial status.
    """
    logger.info(f"Grievance submission started by citizen {current_user.id}")
    
    # Validate grievance length
    if len(grievance_data.description) > 5000:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Grievance description too long (max 5000 characters)"
        )
    
    # Get existing grievances for duplicate detection
    existing_grievances = db.query(Grievance).filter(
        Grievance.citizen_id == current_user.id
    ).all()
    
    existing_docs = [
        {
            "id": str(g.id),
            "text": g.description,
            "status": g.status.value
        }
        for g in existing_grievances
    ]
    
    # Run AI analysis
    ai_analysis = ai_service.analyze_grievance(
        grievance_data.description,
        existing_docs
    )
    logger.info(f"AI analysis complete: {ai_analysis}")
    
    # Route to department
    routing_result = RoutingService.route_grievance(
        db,
        grievance_id="temp",  # Will be updated after creation
        category=ai_analysis["category"],
        priority_score=ai_analysis["priority_score"],
        is_duplicate=ai_analysis["is_duplicate"]
    )
    
    if not routing_result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=routing_result["message"]
        )
    
    # Create grievance
    from app.models.grievance import Grievance
    grievance = GrievanceService.create_grievance(
        db,
        citizen_id=str(current_user.id),
        department_id=routing_result["department_id"],
        grievance_data=grievance_data,
        ai_analysis=ai_analysis
    )
    
    if not grievance:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create grievance"
        )
    
    # Send notification
    NotificationService.notify_grievance_submitted(
        recipient_email=current_user.email,
        citizen_name=current_user.full_name,
        grievance_id=str(grievance.id),
        category=grievance.category.value,
        urgency=grievance.urgency.value
    )
    
    logger.info(f"Grievance created successfully: {grievance.id}")
    
    return {
        "success": True,
        "grievance_id": str(grievance.id),
        "status": grievance.status.value,
        "message": "Grievance submitted successfully",
        "category": grievance.category.value,
        "urgency": grievance.urgency.value,
        "department": routing_result["department_name"],
        "ai_confidence": ai_analysis["ai_confidence"],
        "is_duplicate": ai_analysis["is_duplicate"]
    }


@router.get("/", response_model=GrievanceListResponse)
async def list_grievances(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = None
):
    """
    List grievances based on user role.
    
    - **Citizens**: See their own grievances
    - **Officers**: See assigned grievances
    - **Admins**: See all grievances
    """
    if current_user.role == UserRole.CITIZEN:
        # Citizen can only see their own grievances
        from app.models.grievance import GrievanceStatus
        grievance_status = None
        if status:
            try:
                grievance_status = GrievanceStatus(status)
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid status"
                )
        
        grievances, total = GrievanceService.get_citizen_grievances(
            db, str(current_user.id), skip, limit, grievance_status
        )
        
    elif current_user.role == UserRole.OFFICER:
        # Officer can see assigned grievances
        from app.models.grievance import GrievanceStatus, GrievanceUrgency
        grievance_status = None
        urgency = None
        
        if status:
            try:
                grievance_status = GrievanceStatus(status)
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid status"
                )
        
        grievances, total = GrievanceService.get_officer_grievances(
            db, str(current_user.id), skip, limit, grievance_status, urgency
        )
        
    elif current_user.role == UserRole.ADMIN:
        # Admin can see all grievances
        from app.models.grievance import Grievance
        query = db.query(Grievance)
        
        if status:
            from app.models.grievance import GrievanceStatus
            try:
                grievance_status = GrievanceStatus(status)
                query = query.filter(Grievance.status == grievance_status)
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid status"
                )
        
        total = query.count()
        grievances = query.order_by(Grievance.created_at.desc()).offset(skip).limit(limit).all()
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    return GrievanceListResponse(
        items=[GrievanceResponse.from_orm(g) for g in grievances],
        total=total,
        skip=skip,
        limit=limit
    )


@router.get("/{grievance_id}", response_model=GrievanceResponse)
async def get_grievance(
    grievance_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get grievance details by ID.
    
    Permissions:
    - Citizen can view their own grievances
    - Officer can view assigned grievances
    - Admin can view any grievance
    """
    grievance = GrievanceService.get_grievance(db, grievance_id)
    
    if not grievance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Grievance not found"
        )
    
    # Check permissions
    if current_user.role == UserRole.CITIZEN:
        if grievance.citizen_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this grievance"
            )
    elif current_user.role == UserRole.OFFICER:
        if grievance.officer_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this grievance"
            )
    
    return GrievanceResponse.from_orm(grievance)


@router.put("/{grievance_id}/status", response_model=dict)
async def update_grievance_status(
    grievance_id: str,
    update_data: GrievanceUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update grievance status.
    
    Only officers and admins can update status.
    """
    if current_user.role not in [UserRole.OFFICER, UserRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only officers can update grievance status"
        )
    
    grievance = GrievanceService.get_grievance(db, grievance_id)
    
    if not grievance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Grievance not found"
        )
    
    # Check permissions
    if current_user.role == UserRole.OFFICER and grievance.officer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this grievance"
        )
    
    from app.models.grievance import GrievanceStatus
    try:
        new_status = GrievanceStatus(update_data.status)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status"
        )
    
    success = GrievanceService.update_grievance_status(
        db,
        grievance_id,
        new_status,
        str(current_user.id),
        current_user.role.value,
        update_data.comment
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update grievance status"
        )
    
    # Send notification to citizen
    from app.models.user import User as UserModel
    citizen = db.query(UserModel).filter(UserModel.id == grievance.citizen_id).first()
    
    if citizen:
        NotificationService.notify_status_update(
            recipient_email=citizen.email,
            citizen_name=citizen.full_name,
            grievance_id=grievance_id,
            previous_status=grievance.status.value,
            new_status=new_status.value,
            comment=update_data.comment
        )
    
    return {
        "success": True,
        "message": "Grievance status updated",
        "new_status": new_status.value
    }


@router.get("/{grievance_id}/timeline", response_model=GrievanceTimelineResponse)
async def get_timeline(
    grievance_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get grievance timeline (status history and events).
    
    Citizens only see events visible to them.
    """
    grievance = GrievanceService.get_grievance(db, grievance_id)
    
    if not grievance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Grievance not found"
        )
    
    # Check permissions
    if current_user.role == UserRole.CITIZEN:
        if grievance.citizen_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized"
            )
        citizen_view = True
    else:
        citizen_view = False
    
    timeline = GrievanceService.get_timeline(db, grievance_id, citizen_view)
    
    return GrievanceTimelineResponse(
        grievance_id=grievance_id,
        events=[TimelineEventResponse.from_orm(event) for event in timeline],
        total_events=len(timeline)
    )


@router.post("/{grievance_id}/comment")
async def add_comment(
    grievance_id: str,
    comment: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add comment to grievance.
    
    Citizens can add visible comments.
    Officers can add comments (visible flag determined by role).
    """
    grievance = GrievanceService.get_grievance(db, grievance_id)
    
    if not grievance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Grievance not found"
        )
    
    # Check permissions
    if current_user.role == UserRole.CITIZEN:
        if grievance.citizen_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized"
            )
    elif current_user.role == UserRole.OFFICER:
        if grievance.officer_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized"
            )
    
    success = GrievanceService.add_comment(
        db,
        grievance_id,
        str(current_user.id),
        current_user.role.value,
        comment,
        is_visible_to_citizen=True
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to add comment"
        )
    
    return {"success": True, "message": "Comment added"}

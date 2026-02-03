"""Grievance management service"""

from typing import Optional, List, Dict
from datetime import datetime
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_

from app.core.logging import get_logger
from app.models.grievance import Grievance, GrievanceStatus, GrievanceCategory, GrievanceUrgency
from app.models.timeline_event import TimelineEvent, EventType
from app.models.attachment import Attachment
from app.schemas.grievance import GrievanceCreate

logger = get_logger(__name__)


class GrievanceService:
    """Service for grievance management and tracking"""
    
    @staticmethod
    def create_grievance(
        db: Session,
        citizen_id: str,
        department_id: str,
        grievance_data: GrievanceCreate,
        ai_analysis: Dict
    ) -> Optional[Grievance]:
        """
        Create a new grievance.
        
        Args:
            db: Database session
            citizen_id: Citizen user ID
            department_id: Department ID for routing
            grievance_data: Grievance submission data
            ai_analysis: AI analysis results
            
        Returns:
            Created Grievance object or None
        """
        try:
            # Create grievance
            grievance = Grievance(
                citizen_id=UUID(citizen_id),
                department_id=UUID(department_id),
                title=grievance_data.title,
                description=grievance_data.description,
                category=ai_analysis["category"],
                urgency=ai_analysis["urgency"],
                is_duplicate=ai_analysis["is_duplicate"],
                duplicate_of_id=UUID(ai_analysis["duplicate_of_id"]) if ai_analysis["duplicate_of_id"] else None,
                similarity_score=ai_analysis["similarity_score"],
                ai_confidence=ai_analysis["ai_confidence"],
                priority_score=ai_analysis["priority_score"],
                status=GrievanceStatus.SUBMITTED
            )
            
            db.add(grievance)
            db.commit()
            db.refresh(grievance)
            
            # Create timeline event for submission
            GrievanceService.add_timeline_event(
                db=db,
                grievance_id=str(grievance.id),
                event_type=EventType.SUBMITTED,
                actor_id=citizen_id,
                actor_role="citizen",
                description="Grievance submitted",
                is_visible_to_citizen=True
            )
            
            logger.info(f"Grievance created: {grievance.id}")
            return grievance
            
        except Exception as e:
            db.rollback()
            logger.error(f"Error creating grievance: {e}")
            return None
    
    @staticmethod
    def get_grievance(
        db: Session,
        grievance_id: str
    ) -> Optional[Grievance]:
        """Get grievance by ID"""
        try:
            return db.query(Grievance).filter(
                Grievance.id == UUID(grievance_id)
            ).first()
        except Exception as e:
            logger.error(f"Error fetching grievance: {e}")
            return None
    
    @staticmethod
    def get_citizen_grievances(
        db: Session,
        citizen_id: str,
        skip: int = 0,
        limit: int = 10,
        status: Optional[GrievanceStatus] = None
    ) -> tuple[List[Grievance], int]:
        """
        Get all grievances for a citizen.
        
        Args:
            db: Database session
            citizen_id: Citizen ID
            skip: Number of records to skip
            limit: Number of records to return
            status: Optional status filter
            
        Returns:
            Tuple of (grievances, total_count)
        """
        try:
            query = db.query(Grievance).filter(
                Grievance.citizen_id == UUID(citizen_id)
            )
            
            if status:
                query = query.filter(Grievance.status == status)
            
            total = query.count()
            grievances = query.order_by(
                Grievance.created_at.desc()
            ).offset(skip).limit(limit).all()
            
            return grievances, total
            
        except Exception as e:
            logger.error(f"Error fetching citizen grievances: {e}")
            return [], 0
    
    @staticmethod
    def get_officer_grievances(
        db: Session,
        officer_id: str,
        skip: int = 0,
        limit: int = 10,
        status: Optional[GrievanceStatus] = None,
        urgency: Optional[GrievanceUrgency] = None
    ) -> tuple[List[Grievance], int]:
        """
        Get grievances assigned to an officer.
        
        Args:
            db: Database session
            officer_id: Officer ID
            skip: Number of records to skip
            limit: Number of records to return
            status: Optional status filter
            urgency: Optional urgency filter
            
        Returns:
            Tuple of (grievances, total_count)
        """
        try:
            query = db.query(Grievance).filter(
                Grievance.officer_id == UUID(officer_id)
            )
            
            if status:
                query = query.filter(Grievance.status == status)
            
            if urgency:
                query = query.filter(Grievance.urgency == urgency)
            
            total = query.count()
            
            # Order by priority then created_at
            grievances = query.order_by(
                Grievance.priority_score.desc(),
                Grievance.created_at.desc()
            ).offset(skip).limit(limit).all()
            
            return grievances, total
            
        except Exception as e:
            logger.error(f"Error fetching officer grievances: {e}")
            return [], 0
    
    @staticmethod
    def update_grievance_status(
        db: Session,
        grievance_id: str,
        new_status: GrievanceStatus,
        actor_id: str,
        actor_role: str,
        comment: Optional[str] = None
    ) -> bool:
        """
        Update grievance status and create timeline event.
        
        Args:
            db: Database session
            grievance_id: Grievance ID
            new_status: New status
            actor_id: User making the change
            actor_role: Role of the actor
            comment: Optional comment
            
        Returns:
            Success status
        """
        try:
            grievance = db.query(Grievance).filter(
                Grievance.id == UUID(grievance_id)
            ).first()
            
            if not grievance:
                logger.warning(f"Grievance not found: {grievance_id}")
                return False
            
            old_status = grievance.status
            grievance.status = new_status
            
            # Update resolved_at if resolved
            if new_status in [GrievanceStatus.RESOLVED, GrievanceStatus.CLOSED]:
                grievance.resolved_at = datetime.utcnow()
            
            db.commit()
            
            # Create timeline event
            GrievanceService.add_timeline_event(
                db=db,
                grievance_id=grievance_id,
                event_type=EventType.STATUS_UPDATED,
                actor_id=actor_id,
                actor_role=actor_role,
                description=f"Status updated from {old_status.value} to {new_status.value}",
                comment=comment,
                is_visible_to_citizen=True
            )
            
            logger.info(f"Grievance {grievance_id} status updated to {new_status.value}")
            return True
            
        except Exception as e:
            db.rollback()
            logger.error(f"Error updating grievance status: {e}")
            return False
    
    @staticmethod
    def assign_officer(
        db: Session,
        grievance_id: str,
        officer_id: str
    ) -> bool:
        """
        Assign officer to grievance.
        
        Args:
            db: Database session
            grievance_id: Grievance ID
            officer_id: Officer ID to assign
            
        Returns:
            Success status
        """
        try:
            grievance = db.query(Grievance).filter(
                Grievance.id == UUID(grievance_id)
            ).first()
            
            if not grievance:
                return False
            
            grievance.officer_id = UUID(officer_id)
            grievance.assigned_at = datetime.utcnow()
            grievance.status = GrievanceStatus.UNDER_REVIEW
            
            db.commit()
            
            # Create timeline event
            GrievanceService.add_timeline_event(
                db=db,
                grievance_id=grievance_id,
                event_type=EventType.ASSIGNED,
                actor_id=officer_id,
                actor_role="officer",
                description=f"Assigned to officer {officer_id}",
                is_visible_to_citizen=False
            )
            
            logger.info(f"Grievance {grievance_id} assigned to officer {officer_id}")
            return True
            
        except Exception as e:
            db.rollback()
            logger.error(f"Error assigning officer: {e}")
            return False
    
    @staticmethod
    def add_timeline_event(
        db: Session,
        grievance_id: str,
        event_type: EventType,
        actor_id: str,
        actor_role: str,
        description: str,
        comment: Optional[str] = None,
        is_visible_to_citizen: bool = True,
        metadata: Optional[str] = None
    ) -> Optional[TimelineEvent]:
        """
        Add timeline event to grievance.
        
        Args:
            db: Database session
            grievance_id: Grievance ID
            event_type: Type of event
            actor_id: User who triggered event
            actor_role: Role of actor
            description: Event description
            comment: Optional comment
            is_visible_to_citizen: Visibility flag
            metadata: Optional metadata JSON
            
        Returns:
            Created TimelineEvent or None
        """
        try:
            event = TimelineEvent(
                grievance_id=UUID(grievance_id),
                event_type=event_type,
                actor_id=UUID(actor_id),
                actor_role=actor_role,
                description=description,
                comment=comment,
                is_visible_to_citizen=is_visible_to_citizen,
                metadata=metadata
            )
            
            db.add(event)
            db.commit()
            db.refresh(event)
            
            return event
            
        except Exception as e:
            db.rollback()
            logger.error(f"Error adding timeline event: {e}")
            return None
    
    @staticmethod
    def get_timeline(
        db: Session,
        grievance_id: str,
        citizen_view: bool = False
    ) -> List[TimelineEvent]:
        """
        Get timeline events for grievance.
        
        Args:
            db: Database session
            grievance_id: Grievance ID
            citizen_view: If True, filter non-citizen-visible events
            
        Returns:
            List of timeline events
        """
        try:
            query = db.query(TimelineEvent).filter(
                TimelineEvent.grievance_id == UUID(grievance_id)
            )
            
            if citizen_view:
                query = query.filter(TimelineEvent.is_visible_to_citizen == True)
            
            events = query.order_by(TimelineEvent.created_at.asc()).all()
            return events
            
        except Exception as e:
            logger.error(f"Error fetching timeline: {e}")
            return []
    
    @staticmethod
    def add_comment(
        db: Session,
        grievance_id: str,
        actor_id: str,
        actor_role: str,
        comment: str,
        is_visible_to_citizen: bool = True
    ) -> bool:
        """
        Add comment to grievance.
        
        Args:
            db: Database session
            grievance_id: Grievance ID
            actor_id: User adding comment
            actor_role: Role of actor
            comment: Comment text
            is_visible_to_citizen: Visibility flag
            
        Returns:
            Success status
        """
        try:
            GrievanceService.add_timeline_event(
                db=db,
                grievance_id=grievance_id,
                event_type=EventType.COMMENT_ADDED,
                actor_id=actor_id,
                actor_role=actor_role,
                description=f"Comment added by {actor_role}",
                comment=comment,
                is_visible_to_citizen=is_visible_to_citizen
            )
            
            logger.info(f"Comment added to grievance {grievance_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error adding comment: {e}")
            return False
    
    @staticmethod
    def add_attachment(
        db: Session,
        grievance_id: str,
        file_name: str,
        file_size: int,
        file_type: str,
        file_url: str,
        uploaded_by: str
    ) -> Optional[Attachment]:
        """
        Add attachment to grievance.
        
        Args:
            db: Database session
            grievance_id: Grievance ID
            file_name: File name
            file_size: File size in bytes
            file_type: MIME type
            file_url: File URL in cloud storage
            uploaded_by: User who uploaded
            
        Returns:
            Created Attachment or None
        """
        try:
            attachment = Attachment(
                grievance_id=UUID(grievance_id),
                file_name=file_name,
                file_size=file_size,
                file_type=file_type,
                file_url=file_url,
                uploaded_by=UUID(uploaded_by)
            )
            
            db.add(attachment)
            db.commit()
            db.refresh(attachment)
            
            # Create timeline event
            GrievanceService.add_timeline_event(
                db=db,
                grievance_id=grievance_id,
                event_type=EventType.ATTACHMENT_ADDED,
                actor_id=uploaded_by,
                actor_role="citizen",
                description=f"Attachment added: {file_name}",
                is_visible_to_citizen=True
            )
            
            logger.info(f"Attachment added to grievance {grievance_id}")
            return attachment
            
        except Exception as e:
            db.rollback()
            logger.error(f"Error adding attachment: {e}")
            return None
    
    @staticmethod
    def get_attachments(
        db: Session,
        grievance_id: str
    ) -> List[Attachment]:
        """
        Get attachments for grievance.
        
        Args:
            db: Database session
            grievance_id: Grievance ID
            
        Returns:
            List of attachments
        """
        try:
            return db.query(Attachment).filter(
                Attachment.grievance_id == UUID(grievance_id)
            ).order_by(Attachment.uploaded_at.desc()).all()
        except Exception as e:
            logger.error(f"Error fetching attachments: {e}")
            return []

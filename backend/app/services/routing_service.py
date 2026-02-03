"""Automatic grievance routing service"""

from typing import Dict, Optional
from sqlalchemy.orm import Session
from app.core.logging import get_logger
from app.models.grievance import GrievanceCategory
from app.models.department import Department

logger = get_logger(__name__)


class RoutingService:
    """Service for automatic department routing"""
    
    # Default category to department mapping
    CATEGORY_DEPARTMENT_MAP = {
        GrievanceCategory.WATER_SUPPLY: "water",
        GrievanceCategory.ROAD_MAINTENANCE: "public_works",
        GrievanceCategory.ELECTRICITY: "power",
        GrievanceCategory.WASTE_MANAGEMENT: "sanitation",
        GrievanceCategory.PUBLIC_HEALTH: "health",
        GrievanceCategory.EDUCATION: "education",
        GrievanceCategory.POLICE: "police",
        GrievanceCategory.MUNICIPAL: "municipal",
        GrievanceCategory.TRANSPORT: "transport",
        GrievanceCategory.ENVIRONMENT: "environment",
        GrievanceCategory.OTHER: "general",
    }
    
    @staticmethod
    def get_best_department(
        db: Session,
        category: GrievanceCategory,
        priority_score: float
    ) -> Optional[Department]:
        """
        Find the best department to handle grievance based on category and load.
        
        Args:
            db: Database session
            category: Grievance category
            priority_score: Priority score (0.0-1.0)
            
        Returns:
            Department object or None if no suitable department found
        """
        # Get department code from category
        dept_code = RoutingService.CATEGORY_DEPARTMENT_MAP.get(
            category,
            RoutingService.CATEGORY_DEPARTMENT_MAP[GrievanceCategory.OTHER]
        )
        
        # Query departments that handle this category
        departments = db.query(Department).filter(
            Department.code == dept_code,
            Department.current_load < Department.max_capacity
        ).order_by(
            Department.current_load.asc()  # Least loaded first
        ).all()
        
        if not departments:
            logger.warning(f"No available departments for category {category}")
            # Try to find any available department
            departments = db.query(Department).filter(
                Department.current_load < Department.max_capacity
            ).order_by(
                Department.current_load.asc()
            ).limit(1).all()
        
        if not departments:
            logger.error(f"No available departments found")
            return None
        
        best_dept = departments[0]
        logger.info(
            f"Routed grievance to department {best_dept.name} "
            f"(load: {best_dept.current_load}/{best_dept.max_capacity})"
        )
        return best_dept
    
    @staticmethod
    def route_grievance(
        db: Session,
        grievance_id: str,
        category: GrievanceCategory,
        priority_score: float,
        is_duplicate: bool = False
    ) -> Dict[str, any]:
        """
        Route grievance to appropriate department.
        
        Args:
            db: Database session
            grievance_id: Grievance ID
            category: Grievance category
            priority_score: Priority score
            is_duplicate: Whether it's a duplicate
            
        Returns:
            Routing result dict
        """
        logger.info(f"Starting routing for grievance {grievance_id}")
        
        # Get best department
        department = RoutingService.get_best_department(db, category, priority_score)
        
        if not department:
            return {
                "success": False,
                "message": "No suitable department found",
                "department_id": None,
                "reason": "All departments at capacity"
            }
        
        # Update department load
        try:
            department.current_load += 1
            db.commit()
            
            result = {
                "success": True,
                "message": "Grievance routed successfully",
                "department_id": str(department.id),
                "department_name": department.name,
                "department_code": department.code,
                "priority_score": priority_score,
                "is_duplicate": is_duplicate,
                "expected_resolution_time": department.avg_resolution_time
            }
            
            logger.info(f"Grievance {grievance_id} routed to {department.name}")
            return result
            
        except Exception as e:
            db.rollback()
            logger.error(f"Error routing grievance: {e}")
            return {
                "success": False,
                "message": f"Routing failed: {str(e)}",
                "department_id": None,
                "reason": str(e)
            }
    
    @staticmethod
    def assign_officer(
        db: Session,
        department_id: str
    ) -> Optional[str]:
        """
        Assign best available officer from department.
        
        Args:
            db: Database session
            department_id: Department ID
            
        Returns:
            Officer ID or None if no officers available
        """
        try:
            # This would typically find the least loaded officer in the department
            # For now, returns first available officer
            from app.models.user import User, UserRole
            
            officer = db.query(User).filter(
                User.department_id == department_id,
                User.role == UserRole.OFFICER,
                User.is_active == True
            ).first()
            
            if officer:
                logger.info(f"Assigned officer {officer.id} to department {department_id}")
                return str(officer.id)
            
            logger.warning(f"No available officers in department {department_id}")
            return None
            
        except Exception as e:
            logger.error(f"Error assigning officer: {e}")
            return None

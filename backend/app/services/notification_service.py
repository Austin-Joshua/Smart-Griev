"""Email notification service"""

import json
from typing import List, Dict, Optional
from datetime import datetime
from app.core.logging import get_logger
from app.core.config import settings

logger = get_logger(__name__)


class NotificationService:
    """Service for sending notifications via email"""
    
    # Email templates
    TEMPLATES = {
        "grievance_submitted": {
            "subject": "Your Grievance Has Been Submitted - #{grievance_id}",
            "body": """
Dear {citizen_name},

Thank you for submitting your grievance. We have received your submission and it is now being processed.

Grievance ID: {grievance_id}
Category: {category}
Urgency: {urgency}
Status: {status}

You can track the status of your grievance using your unique ID above.

We will review your grievance and take appropriate action as soon as possible.

Best regards,
Smart Griev Team
            """
        },
        "grievance_assigned": {
            "subject": "Grievance Assigned to Officer - #{grievance_id}",
            "body": """
Dear {citizen_name},

Your grievance has been assigned to an officer for review.

Grievance ID: {grievance_id}
Assigned Officer: {officer_name}
Department: {department_name}
Status: {status}

The assigned officer will contact you soon with updates.

Best regards,
Smart Griev Team
            """
        },
        "status_updated": {
            "subject": "Grievance Status Updated - #{grievance_id}",
            "body": """
Dear {citizen_name},

Your grievance status has been updated.

Grievance ID: {grievance_id}
Previous Status: {previous_status}
New Status: {status}
Updated At: {updated_at}

{comment_section}

You can view more details on your dashboard.

Best regards,
Smart Griev Team
            """
        },
        "grievance_resolved": {
            "subject": "Your Grievance Has Been Resolved - #{grievance_id}",
            "body": """
Dear {citizen_name},

Your grievance has been successfully resolved.

Grievance ID: {grievance_id}
Department: {department_name}
Resolved At: {resolved_at}

{resolution_details}

Thank you for bringing this matter to our attention. If you have any further concerns, please feel free to submit a new grievance.

Best regards,
Smart Griev Team
            """
        },
        "officer_assignment": {
            "subject": "New Grievance Assigned - #{grievance_id}",
            "body": """
Dear {officer_name},

A new grievance has been assigned to you for processing.

Grievance ID: {grievance_id}
Citizen: {citizen_name}
Category: {category}
Urgency: {urgency}
Priority Score: {priority_score}

Grievance Details:
{grievance_text}

Please review and take appropriate action.

Best regards,
Smart Griev System
            """
        }
    }
    
    @staticmethod
    def send_notification(
        recipient_email: str,
        template_name: str,
        template_vars: Dict[str, str]
    ) -> bool:
        """
        Send email notification.
        
        Args:
            recipient_email: Recipient email address
            template_name: Name of email template
            template_vars: Variables to fill in template
            
        Returns:
            Success status
        """
        try:
            # In production, use SendGrid or similar service
            logger.info(f"Sending notification to {recipient_email} using template {template_name}")
            
            if not settings.sendgrid_api_key:
                logger.warning("SendGrid API key not configured")
                # In development, just log
                NotificationService._log_notification(
                    recipient_email, template_name, template_vars
                )
                return True
            
            # Implementation would use SendGrid SDK here
            # This is a placeholder for production implementation
            NotificationService._log_notification(
                recipient_email, template_name, template_vars
            )
            
            return True
            
        except Exception as e:
            logger.error(f"Error sending notification: {e}")
            return False
    
    @staticmethod
    def _log_notification(
        recipient_email: str,
        template_name: str,
        template_vars: Dict[str, str]
    ):
        """Log notification for development/debugging"""
        template = NotificationService.TEMPLATES.get(template_name, {})
        subject = template.get("subject", "Notification").format(**template_vars)
        
        logger.info(f"\n{'='*60}")
        logger.info(f"EMAIL NOTIFICATION")
        logger.info(f"{'='*60}")
        logger.info(f"To: {recipient_email}")
        logger.info(f"Subject: {subject}")
        logger.info(f"Template: {template_name}")
        logger.info(f"Variables: {json.dumps(template_vars, indent=2)}")
        logger.info(f"{'='*60}\n")
    
    @staticmethod
    def notify_grievance_submitted(
        recipient_email: str,
        citizen_name: str,
        grievance_id: str,
        category: str,
        urgency: str
    ) -> bool:
        """Notify citizen that grievance was submitted"""
        return NotificationService.send_notification(
            recipient_email,
            "grievance_submitted",
            {
                "citizen_name": citizen_name,
                "grievance_id": grievance_id,
                "category": category,
                "urgency": urgency,
                "status": "Submitted"
            }
        )
    
    @staticmethod
    def notify_grievance_assigned(
        recipient_email: str,
        citizen_name: str,
        grievance_id: str,
        officer_name: str,
        department_name: str
    ) -> bool:
        """Notify citizen that grievance was assigned"""
        return NotificationService.send_notification(
            recipient_email,
            "grievance_assigned",
            {
                "citizen_name": citizen_name,
                "grievance_id": grievance_id,
                "officer_name": officer_name,
                "department_name": department_name,
                "status": "Under Review"
            }
        )
    
    @staticmethod
    def notify_status_update(
        recipient_email: str,
        citizen_name: str,
        grievance_id: str,
        previous_status: str,
        new_status: str,
        comment: Optional[str] = None
    ) -> bool:
        """Notify citizen of status update"""
        comment_section = f"Officer Comment:\n{comment}" if comment else ""
        
        return NotificationService.send_notification(
            recipient_email,
            "status_updated",
            {
                "citizen_name": citizen_name,
                "grievance_id": grievance_id,
                "previous_status": previous_status,
                "status": new_status,
                "updated_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
                "comment_section": comment_section
            }
        )
    
    @staticmethod
    def notify_grievance_resolved(
        recipient_email: str,
        citizen_name: str,
        grievance_id: str,
        department_name: str,
        resolution_details: Optional[str] = None
    ) -> bool:
        """Notify citizen that grievance was resolved"""
        return NotificationService.send_notification(
            recipient_email,
            "grievance_resolved",
            {
                "citizen_name": citizen_name,
                "grievance_id": grievance_id,
                "department_name": department_name,
                "resolved_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
                "resolution_details": resolution_details or "Your grievance has been successfully addressed."
            }
        )
    
    @staticmethod
    def notify_officer_assignment(
        recipient_email: str,
        officer_name: str,
        grievance_id: str,
        citizen_name: str,
        category: str,
        urgency: str,
        priority_score: float,
        grievance_text: str
    ) -> bool:
        """Notify officer of new grievance assignment"""
        return NotificationService.send_notification(
            recipient_email,
            "officer_assignment",
            {
                "officer_name": officer_name,
                "grievance_id": grievance_id,
                "citizen_name": citizen_name,
                "category": category,
                "urgency": urgency,
                "priority_score": f"{priority_score:.2f}",
                "grievance_text": grievance_text[:500]  # First 500 chars
            }
        )

"""Database base configuration"""

from app.models.base import Base
from app.models.user import User
from app.models.grievance import Grievance
from app.models.timeline_event import TimelineEvent
from app.models.attachment import Attachment
from app.models.department import Department

# Make all models available for migrations
__all__ = ["Base", "User", "Grievance", "TimelineEvent", "Attachment", "Department"]

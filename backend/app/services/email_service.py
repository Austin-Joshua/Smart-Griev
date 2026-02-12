
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

class EmailService:
    """Service for sending emails via SendGrid"""
    
    @staticmethod
    def send_email(to_email: str, subject: str, content: str, is_html: bool = True) -> bool:
        """
        Send an email.
        
        Args:
            to_email: Recipient email
            subject: Email subject
            content: Email body
            is_html: Whether content is HTML
            
        Returns:
            Success status
        """
        if not settings.sendgrid_api_key:
            logger.warning("SendGrid API key not set. Skipping email.")
            return False
            
        try:
            sg = SendGridAPIClient(api_key=settings.sendgrid_api_key)
            from_email = Email(settings.sendgrid_from_email, settings.sendgrid_from_name)
            to_email = To(to_email)
            mime_type = "text/html" if is_html else "text/plain"
            content = Content(mime_type, content)
            
            mail = Mail(from_email, to_email, subject, content)
            
            response = sg.client.mail.send.post(request_body=mail.get())
            
            if 200 <= response.status_code < 300:
                logger.info(f"Email sent to {to_email.email}")
                return True
            else:
                logger.error(f"Failed to send email. Status code: {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"Error sending email: {e}")
            return False


import os
import shutil
from datetime import datetime
from pathlib import Path
from uuid import uuid4
from fastapi import UploadFile
from app.core.logging import get_logger

logger = get_logger(__name__)

class FileService:
    """Service for handling file uploads and storage"""
    
    UPLOAD_DIR = Path("uploads")
    ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx'}
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
    
    @classmethod
    def save_upload(cls, file: UploadFile) -> dict:
        """
        Save uploaded file to local storage.
        
        Args:
            file: FastAPI UploadFile object
            
        Returns:
            Dictionary with file details including URL
        """
        try:
            # Create uploads directory if not exists
            cls.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
            
            # Validate extension
            ext = Path(file.filename).suffix.lower()
            if ext not in cls.ALLOWED_EXTENSIONS:
                raise ValueError(f"File type {ext} not allowed")
                
            # Generate unique filename
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            unique_id = str(uuid4())[:8]
            safe_filename = f"{timestamp}_{unique_id}{ext}"
            file_path = cls.UPLOAD_DIR / safe_filename
            
            # Save file
            with file_path.open("wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
                
            # Get file size
            file_size = file_path.stat().st_size
            
            # Generate URL (relative to static mount)
            file_url = f"/static/uploads/{safe_filename}"
            
            return {
                "file_name": file.filename,
                "file_type": file.content_type,
                "file_size": file_size,
                "file_url": file_url,
                "success": True
            }
            
        except Exception as e:
            logger.error(f"File upload failed: {str(e)}")
            return {"success": False, "error": str(e)}

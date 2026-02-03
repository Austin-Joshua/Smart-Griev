"""Logging configuration for the application"""

import logging
import logging.handlers
from pathlib import Path
from .config import settings

# Create logs directory if it doesn't exist
log_dir = Path(settings.log_file).parent
log_dir.mkdir(parents=True, exist_ok=True)


def setup_logging():
    """Configure application logging"""
    
    # Root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(settings.log_level)
    
    # Log format
    log_format = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    
    # File handler with rotation
    file_handler = logging.handlers.RotatingFileHandler(
        settings.log_file,
        maxBytes=10485760,  # 10MB
        backupCount=5
    )
    file_handler.setLevel(settings.log_level)
    file_handler.setFormatter(log_format)
    root_logger.addHandler(file_handler)
    
    # Console handler for development
    if settings.debug:
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.DEBUG)
        console_handler.setFormatter(log_format)
        root_logger.addHandler(console_handler)
    
    return root_logger


# Create logger instance
logger = setup_logging()


def get_logger(name: str) -> logging.Logger:
    """Get a logger instance for a module"""
    return logging.getLogger(name)

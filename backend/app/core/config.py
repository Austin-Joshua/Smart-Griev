"""Application configuration and environment settings"""

from pydantic_settings import BaseSettings
from typing import List, Optional
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # Application
    app_name: str = "Smart Griev - AI-Powered Grievance Management"
    app_version: str = "1.0.0"
    environment: str = os.getenv("ENVIRONMENT", "development")
    debug: bool = os.getenv("DEBUG", "True").lower() == "true"
    log_level: str = os.getenv("LOG_LEVEL", "INFO")

    # Server
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8000"))
    api_v1_str: str = "/api/v1"
    backend_cors_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000",
    ]

    # Database
    database_type: str = os.getenv("DATABASE_TYPE", "postgresql")
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql://user:password@localhost:5432/smartgriev_db"
    )
    mongodb_url: Optional[str] = os.getenv("MONGODB_URL")

    # Firebase Authentication
    firebase_project_id: Optional[str] = os.getenv("FIREBASE_PROJECT_ID")
    firebase_private_key_id: Optional[str] = os.getenv("FIREBASE_PRIVATE_KEY_ID")
    firebase_private_key: Optional[str] = os.getenv("FIREBASE_PRIVATE_KEY")
    firebase_client_email: Optional[str] = os.getenv("FIREBASE_CLIENT_EMAIL")
    firebase_client_id: Optional[str] = os.getenv("FIREBASE_CLIENT_ID")

    # JWT
    secret_key: str = os.getenv("SECRET_KEY", "change-this-key-in-production")
    algorithm: str = os.getenv("ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
    )
    refresh_token_expire_days: int = int(
        os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7")
    )

    # AI/NLP
    nlp_model: str = os.getenv("NLP_MODEL", "bert")
    tf_idf_min_df: int = int(os.getenv("TF_IDF_MIN_DF", "2"))
    tf_idf_max_df: float = float(os.getenv("TF_IDF_MAX_DF", "0.95"))
    similarity_threshold: float = float(os.getenv("SIMILARITY_THRESHOLD", "0.75"))
    max_grievance_length: int = int(os.getenv("MAX_GRIEVANCE_LENGTH", "5000"))

    # Email
    sendgrid_api_key: Optional[str] = os.getenv("SENDGRID_API_KEY")
    sendgrid_from_email: str = os.getenv(
        "SENDGRID_FROM_EMAIL", "noreply@smartgriev.com"
    )
    sendgrid_from_name: str = os.getenv("SENDGRID_FROM_NAME", "Smart Griev")

    # Cloud Storage
    aws_access_key_id: Optional[str] = os.getenv("AWS_ACCESS_KEY_ID")
    aws_secret_access_key: Optional[str] = os.getenv("AWS_SECRET_ACCESS_KEY")
    aws_s3_bucket_name: str = os.getenv("AWS_S3_BUCKET_NAME", "smartgriev-attachments")
    aws_region: str = os.getenv("AWS_REGION", "us-east-1")

    # Google Cloud
    google_cloud_project_id: Optional[str] = os.getenv("GOOGLE_CLOUD_PROJECT_ID")
    google_cloud_storage_bucket: str = os.getenv(
        "GOOGLE_CLOUD_STORAGE_BUCKET", "smartgriev-attachments"
    )

    # Redis
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    redis_host: str = os.getenv("REDIS_HOST", "localhost")
    redis_port: int = int(os.getenv("REDIS_PORT", "6379"))
    redis_db: int = int(os.getenv("REDIS_DB", "0"))

    # Celery
    celery_broker_url: str = os.getenv(
        "CELERY_BROKER_URL", "redis://localhost:6379/0"
    )
    celery_result_backend: str = os.getenv(
        "CELERY_RESULT_BACKEND", "redis://localhost:6379/0"
    )

    # Business Logic
    default_response_time_hours: int = int(
        os.getenv("DEFAULT_RESPONSE_TIME_HOURS", "48")
    )
    escalation_time_hours: int = int(os.getenv("ESCALATION_TIME_HOURS", "72"))

    # Logging
    log_file: str = os.getenv("LOG_FILE", "logs/app.log")

    class Config:
        env_file = ".env"
        case_sensitive = False


# Create global settings instance
settings = Settings()

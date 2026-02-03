"""Application configuration and environment settings"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
env_path = Path(__file__).parent.parent.parent / ".env"
if env_path.exists():
    load_dotenv(env_path)


class Settings:
    """Application settings loaded from environment variables"""
    
    def __init__(self):
        # Application
        self.app_name = "Smart Griev - AI-Powered Grievance Management"
        self.app_version = "1.0.0"
        self.environment = os.getenv("ENVIRONMENT", "development")
        self.debug = os.getenv("DEBUG", "True").lower() == "true"
        self.log_level = os.getenv("LOG_LEVEL", "INFO")
        
        # Server
        self.host = os.getenv("HOST", "0.0.0.0")
        self.port = int(os.getenv("PORT", "8000"))
        self.api_v1_str = "/api/v1"
        self.backend_cors_origins = [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:8000",
        ]
        
        # Database
        self.database_type = os.getenv("DATABASE_TYPE", "postgresql")
        self.database_url = os.getenv(
            "DATABASE_URL",
            "sqlite:///./smartgriev.db"
        )
        self.mongodb_url = os.getenv("MONGODB_URL")
        
        # Firebase Authentication
        self.firebase_project_id = os.getenv("FIREBASE_PROJECT_ID")
        self.firebase_private_key_id = os.getenv("FIREBASE_PRIVATE_KEY_ID")
        self.firebase_private_key = os.getenv("FIREBASE_PRIVATE_KEY")
        self.firebase_client_email = os.getenv("FIREBASE_CLIENT_EMAIL")
        self.firebase_client_id = os.getenv("FIREBASE_CLIENT_ID")
        
        # JWT
        self.secret_key = os.getenv("SECRET_KEY", "dev-secret-key-12345")
        self.algorithm = os.getenv("ALGORITHM", "HS256")
        self.access_token_expire_minutes = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
        self.refresh_token_expire_days = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
        
        # AI/NLP
        self.nlp_model = os.getenv("NLP_MODEL", "bert")
        self.tf_idf_min_df = int(os.getenv("TF_IDF_MIN_DF", "2"))
        self.tf_idf_max_df = float(os.getenv("TF_IDF_MAX_DF", "0.95"))
        self.similarity_threshold = float(os.getenv("SIMILARITY_THRESHOLD", "0.75"))
        self.max_grievance_length = int(os.getenv("MAX_GRIEVANCE_LENGTH", "5000"))
        
        # Email
        self.sendgrid_api_key = os.getenv("SENDGRID_API_KEY")
        self.sendgrid_from_email = os.getenv("SENDGRID_FROM_EMAIL", "noreply@smartgriev.com")
        self.sendgrid_from_name = os.getenv("SENDGRID_FROM_NAME", "Smart Griev")
        
        # Cloud Storage
        self.aws_access_key_id = os.getenv("AWS_ACCESS_KEY_ID")
        self.aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY")
        self.aws_s3_bucket_name = os.getenv("AWS_S3_BUCKET_NAME", "smartgriev-attachments")
        self.aws_region = os.getenv("AWS_REGION", "us-east-1")
        
        # Google Cloud
        self.google_cloud_project_id = os.getenv("GOOGLE_CLOUD_PROJECT_ID")
        self.google_cloud_storage_bucket = os.getenv("GOOGLE_CLOUD_STORAGE_BUCKET", "smartgriev-attachments")
        
        # Redis
        self.redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        self.redis_host = os.getenv("REDIS_HOST", "localhost")
        self.redis_port = int(os.getenv("REDIS_PORT", "6379"))
        self.redis_db = int(os.getenv("REDIS_DB", "0"))
        
        # Celery
        self.celery_broker_url = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
        self.celery_result_backend = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")
        
        # Business Logic
        self.default_response_time_hours = int(os.getenv("DEFAULT_RESPONSE_TIME_HOURS", "48"))
        self.escalation_time_hours = int(os.getenv("ESCALATION_TIME_HOURS", "72"))
        
        # Logging
        self.log_file = os.getenv("LOG_FILE", "logs/app.log")


# Create global settings instance
settings = Settings()

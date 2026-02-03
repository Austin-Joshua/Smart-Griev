# Smart Griev Backend - AI-Powered Grievance Management System

Production-ready FastAPI backend for the Smart Grievance Management System.

## Project Overview

Smart Griev is an end-to-end solution for efficient grievance management with:

- **AI-Powered Analysis**: Automatic categorization and urgency detection
- **Intelligent Routing**: Auto-route grievances to relevant departments
- **Duplicate Detection**: Identify duplicate/similar grievances using TF-IDF
- **Role-Based Access**: Separate dashboards for citizens, officers, and admins
- **Real-time Tracking**: Complete timeline and status updates
- **Email Notifications**: Event-driven notifications via SendGrid

## Architecture

```
Smart Griev Backend
├── app/
│   ├── api/               # API endpoints
│   │   └── v1/            # API v1
│   │       └── endpoints/ # Route handlers
│   ├── core/              # Core configuration and security
│   ├── models/            # SQLAlchemy ORM models
│   ├── schemas/           # Pydantic validation schemas
│   ├── services/          # Business logic services
│   ├── db/                # Database configuration
│   ├── utils/             # Utilities and helpers
│   └── main.py            # FastAPI application
├── tests/                 # Test suite
├── requirements.txt       # Python dependencies
├── .env.example           # Environment variables template
└── README.md              # This file
```

## Technology Stack

- **Framework**: FastAPI 0.104.1
- **Server**: Uvicorn
- **Database**: PostgreSQL (with SQLAlchemy ORM)
- **Authentication**: JWT + Bcrypt
- **AI/NLP**: Scikit-learn (TF-IDF, Cosine Similarity)
- **Email**: SendGrid
- **Cloud Storage**: AWS S3 or Google Cloud Storage
- **Caching**: Redis
- **Async Jobs**: Celery

## Installation

### Prerequisites

- Python 3.9+
- PostgreSQL 12+
- Redis (optional, for caching)
- SendGrid account (for email notifications)

### Setup

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Initialize database**
   ```bash
   python -m alembic upgrade head
   # Or let the app auto-create tables on first run
   ```

6. **Run development server**
   ```bash
   python -m uvicorn app.main:app --reload
   ```

   Server will be available at `http://localhost:8000`

## Configuration

### Environment Variables

Key environment variables (see `.env.example` for complete list):

```env
# Server
ENVIRONMENT=development
DEBUG=True
HOST=0.0.0.0
PORT=8000

# Database
DATABASE_TYPE=postgresql
DATABASE_URL=postgresql://user:password@localhost:5432/smartgriev_db

# Authentication
SECRET_KEY=your-super-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI/NLP
NLP_MODEL=bert
SIMILARITY_THRESHOLD=0.75

# Email
SENDGRID_API_KEY=your-sendgrid-key
SENDGRID_FROM_EMAIL=noreply@smartgriev.com

# Cloud Storage
AWS_S3_BUCKET_NAME=smartgriev-attachments
AWS_REGION=us-east-1
```

## API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Interactive Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Core Endpoints

#### Authentication

```bash
# Register
POST /api/v1/auth/register
{
  "email": "citizen@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "role": "citizen"
}

# Login
POST /api/v1/auth/login
{
  "email": "citizen@example.com",
  "password": "password123"
}

# Get current user
GET /api/v1/auth/me
Authorization: Bearer <access_token>
```

#### Grievances

```bash
# Submit grievance (with AI analysis and auto-routing)
POST /api/v1/grievances/submit
{
  "title": "No water supply",
  "description": "Water supply has been unavailable for 3 days..."
}

# List citizen's grievances
GET /api/v1/grievances?skip=0&limit=10

# Get grievance details
GET /api/v1/grievances/{grievance_id}

# Get timeline/history
GET /api/v1/grievances/{grievance_id}/timeline

# Update status
PUT /api/v1/grievances/{grievance_id}/status
{
  "status": "in_progress",
  "comment": "Started investigating"
}

# Add comment
POST /api/v1/grievances/{grievance_id}/comment
{
  "comment": "Your grievance is being addressed..."
}
```

#### Officer Workflow

```bash
# Get assigned grievances
GET /api/v1/officers/me/assigned?status=under_review&urgency=high

# Accept grievance
POST /api/v1/officers/{grievance_id}/accept

# Mark as in progress
POST /api/v1/officers/{grievance_id}/mark-in-progress

# Resolve grievance
POST /api/v1/officers/{grievance_id}/resolve
{
  "resolution_details": "Issue resolved by..."
}

# Check escalation
GET /api/v1/officers/{grievance_id}/escalation-check
```

## Workflow

### Grievance Submission Workflow

```
1. Citizen submits grievance
   ↓
2. AI Analysis
   - Classify category (water, electricity, road, etc.)
   - Detect urgency (low, medium, high, critical)
   - Check for duplicates
   - Calculate priority score
   ↓
3. Auto-Routing
   - Find least-loaded department
   - Assign to department
   - Update department load
   ↓
4. Create Database Records
   - Store grievance
   - Create timeline event
   ↓
5. Send Notification
   - Email citizen confirmation
   ↓
6. Officer Assignment (Manual or Auto)
   - Assign to available officer
   - Send officer notification
   ↓
7. Status Tracking
   - Under Review → In Progress → Resolved → Closed
   - Timeline events for each change
   - Citizen notifications
```

## AI/NLP Engine

### Features

1. **Category Classification**
   - Uses keyword matching with TF-IDF
   - Categories: water, electricity, roads, waste, health, education, etc.

2. **Urgency Detection**
   - Analyzes keywords indicating severity
   - Levels: Low, Medium, High, Critical

3. **Duplicate Detection**
   - TF-IDF vectorization of grievance text
   - Cosine similarity comparison with existing grievances
   - Configurable similarity threshold (default: 0.75)

4. **Priority Scoring**
   - Based on urgency, category, and AI confidence
   - 0.0 - 1.0 score for routing and resource allocation

### AI Service Interface

```python
from app.services.ai_service import AIService

ai_service = AIService()

# Analyze grievance
result = ai_service.analyze_grievance(
    text="My water supply is not working",
    existing_grievances=[...]  # For duplicate detection
)

# Result contains:
{
    "category": "water_supply",
    "urgency": "high",
    "is_duplicate": False,
    "ai_confidence": 0.92,
    "priority_score": 0.85,
    "similarity_score": None
}
```

## Database Schema

### Users Table
```sql
id (UUID, PK)
email (unique)
password_hash
full_name
role (citizen, officer, admin)
department_id (for officers)
is_active
is_verified
created_at, updated_at
```

### Grievances Table
```sql
id (UUID, PK)
citizen_id (FK)
officer_id (FK, nullable)
department_id (FK)
title, description
category
urgency
status (submitted, under_review, in_progress, resolved, closed)
is_duplicate
duplicate_of_id (FK, nullable)
similarity_score
ai_confidence
priority_score
assigned_at, resolved_at
created_at, updated_at
```

### TimelineEvents Table
```sql
id (UUID, PK)
grievance_id (FK)
event_type (submitted, assigned, status_updated, etc.)
actor_id (FK)
actor_role
description
comment
is_visible_to_citizen
created_at
```

### Attachments Table
```sql
id (UUID, PK)
grievance_id (FK)
file_name
file_size
file_type
file_url (S3/GCS URL)
uploaded_by (FK)
uploaded_at
```

### Departments Table
```sql
id (UUID, PK)
name
code
categories (comma-separated)
max_capacity
current_load
avg_resolution_time
created_at, updated_at
```

## Authentication & Authorization

### JWT Tokens

- **Access Token**: 30 minutes expiry
- **Refresh Token**: 7 days expiry
- **Algorithm**: HS256

### Role-Based Access Control

| Feature | Citizen | Officer | Admin |
|---------|---------|---------|-------|
| Submit Grievance | ✓ | ✗ | ✗ |
| View Own Grievances | ✓ | ✗ | ✗ |
| View Assigned Grievances | ✗ | ✓ | ✓ |
| Update Status | ✗ | ✓ | ✓ |
| View All Grievances | ✗ | ✗ | ✓ |
| Manage Users | ✗ | ✗ | ✓ |

## Error Handling

All errors follow standard HTTP status codes:

```
200 OK - Success
201 Created - Resource created
400 Bad Request - Invalid input
401 Unauthorized - Auth required
403 Forbidden - Insufficient permissions
404 Not Found - Resource not found
422 Unprocessable Entity - Validation error
500 Internal Server Error - Server error
```

Error response format:

```json
{
  "detail": "Error message",
  "type": "error_type"
}
```

## Logging

- Logs written to `logs/app.log`
- Rotating file handler (10MB per file, 5 backups)
- Console output in development mode
- Structured logging with timestamps and levels

## Testing

### Run tests

```bash
pytest tests/ -v

# With coverage
pytest tests/ --cov=app --cov-report=html
```

### Test categories

- **Unit Tests**: Service and utility functions
- **Integration Tests**: API endpoints
- **E2E Tests**: Complete workflows

## Deployment

### Docker

```bash
# Build image
docker build -t smartgriev-api .

# Run container
docker run -p 8000:8000 --env-file .env smartgriev-api
```

### Production Checklist

- [ ] Set `DEBUG=False`
- [ ] Change `SECRET_KEY` to strong random value
- [ ] Configure PostgreSQL with proper backups
- [ ] Setup Redis for caching
- [ ] Configure email service (SendGrid)
- [ ] Setup cloud storage (AWS S3 or GCS)
- [ ] Configure logging and monitoring
- [ ] Setup SSL/TLS
- [ ] Use reverse proxy (Nginx)
- [ ] Configure rate limiting
- [ ] Setup database migrations (Alembic)
- [ ] Load test API endpoints

## Performance Optimization

- Database query optimization with indexes
- Connection pooling (SQLAlchemy)
- Redis caching layer
- Async task processing (Celery)
- Request/response compression
- Pagination for large result sets

## Security

- Password hashing (bcrypt)
- JWT token authentication
- CORS configuration
- SQL injection prevention (SQLAlchemy ORM)
- Rate limiting
- Input validation (Pydantic)
- HTTPS enforcement
- Secure headers

## Troubleshooting

### Database Connection Error
```
Check DATABASE_URL is correct
Verify PostgreSQL is running
Check network connectivity
```

### JWT Token Invalid
```
Verify SECRET_KEY matches
Check token expiry
Ensure token format is correct (Bearer <token>)
```

### AI Analysis Not Working
```
Check if scikit-learn is installed
Verify NLP model is configured
Check grievance text is valid
```

## Contributing

1. Create feature branch
2. Commit changes with clear messages
3. Write/update tests
4. Ensure all tests pass
5. Submit pull request

## License

Copyright © 2024 Smart Griev. All rights reserved.

## Support

For issues and questions:
- Create GitHub issue
- Email: support@smartgriev.com
- Documentation: https://docs.smartgriev.com

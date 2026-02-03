# Smart Griev API Testing Guide

Complete guide for testing the Smart Griev backend API endpoints.

## Setup for Testing

### 1. Start Backend Server

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Server will run at `http://localhost:8000`

### 2. API Documentation

Open interactive API docs:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### 3. Setup Test Environment

Create test database and departments:

```bash
python
```

```python
from sqlalchemy.orm import Session
from app.db.session import SessionLocal, engine
from app.models.base import Base
from app.models.department import Department
from uuid import uuid4

# Create tables
Base.metadata.create_all(bind=engine)

# Create departments
db = SessionLocal()

departments = [
    Department(
        name="Water Department",
        code="water",
        email="water@example.com",
        categories="water_supply",
        max_capacity=100
    ),
    Department(
        name="Power Department",
        code="power",
        email="power@example.com",
        categories="electricity",
        max_capacity=100
    ),
    Department(
        name="Public Works",
        code="public_works",
        email="pw@example.com",
        categories="road_maintenance",
        max_capacity=100
    ),
]

for dept in departments:
    db.add(dept)
db.commit()
print("Departments created successfully")
```

## Test Workflow

### Step 1: Register Users

#### Register as Citizen

```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "citizen@example.com",
    "password": "Citizen@123",
    "full_name": "John Citizen",
    "phone": "+1234567890",
    "role": "citizen"
  }'
```

**Response:**
```json
{
  "id": "uuid",
  "email": "citizen@example.com",
  "full_name": "John Citizen",
  "role": "citizen",
  "is_active": true,
  "is_verified": false,
  "created_at": "2024-01-01T00:00:00"
}
```

#### Register as Officer

```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "officer@example.com",
    "password": "Officer@123",
    "full_name": "Jane Officer",
    "role": "officer"
  }'
```

### Step 2: Login and Get Token

```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "citizen@example.com",
    "password": "Citizen@123"
  }'
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

**Save the `access_token` for subsequent requests.**

### Step 3: Submit Grievance

```bash
curl -X POST "http://localhost:8000/api/v1/grievances/submit" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "No water supply in colony",
    "description": "Water supply has been unavailable for 3 days. All the taps in my area are dry. This is a serious issue affecting daily life. Please resolve as soon as possible."
  }'
```

**Response:**
```json
{
  "success": true,
  "grievance_id": "uuid",
  "status": "submitted",
  "message": "Grievance submitted successfully",
  "category": "water_supply",
  "urgency": "high",
  "department": "Water Department",
  "ai_confidence": 0.95,
  "is_duplicate": false
}
```

**Save the `grievance_id` for subsequent operations.**

### Step 4: View Grievance (Citizen)

```bash
curl -X GET "http://localhost:8000/api/v1/grievances/{grievance_id}" \
  -H "Authorization: Bearer YOUR_CITIZEN_TOKEN"
```

### Step 5: View Timeline

```bash
curl -X GET "http://localhost:8000/api/v1/grievances/{grievance_id}/timeline" \
  -H "Authorization: Bearer YOUR_CITIZEN_TOKEN"
```

**Response:**
```json
{
  "grievance_id": "uuid",
  "events": [
    {
      "id": "uuid",
      "grievance_id": "uuid",
      "event_type": "submitted",
      "actor_id": "citizen_uuid",
      "actor_role": "citizen",
      "description": "Grievance submitted",
      "comment": null,
      "is_visible_to_citizen": true,
      "created_at": "2024-01-01T00:00:00"
    }
  ],
  "total_events": 1
}
```

### Step 6: Officer Accepts Grievance

First, login as officer and get their token.

```bash
curl -X POST "http://localhost:8000/api/v1/officers/{grievance_id}/accept" \
  -H "Authorization: Bearer YOUR_OFFICER_TOKEN" \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": true,
  "message": "Grievance accepted",
  "grievance_id": "uuid"
}
```

### Step 7: Officer Marks as In Progress

```bash
curl -X POST "http://localhost:8000/api/v1/officers/{grievance_id}/mark-in-progress" \
  -H "Authorization: Bearer YOUR_OFFICER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "Started investigating the issue. Water pipes are being checked."
  }'
```

### Step 8: Officer Resolves Grievance

```bash
curl -X POST "http://localhost:8000/api/v1/officers/{grievance_id}/resolve" \
  -H "Authorization: Bearer YOUR_OFFICER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "resolution_details": "Main water line was repaired. Water supply restored to full capacity."
  }'
```

### Step 9: Add Comment

```bash
curl -X POST "http://localhost:8000/api/v1/grievances/{grievance_id}/comment" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "Thank you for your response. The issue has been resolved."
  }'
```

### Step 10: Check Escalation

```bash
curl -X GET "http://localhost:8000/api/v1/officers/{grievance_id}/escalation-check" \
  -H "Authorization: Bearer YOUR_OFFICER_TOKEN"
```

## Test Duplicate Detection

### Submit Similar Grievance

```bash
curl -X POST "http://localhost:8000/api/v1/grievances/submit" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Water shortage in my area",
    "description": "There has been no water supply for three days now. The pipes seem to be damaged. Please send someone to fix it immediately."
  }'
```

Response should indicate duplicate with similarity score:

```json
{
  "success": true,
  "grievance_id": "new_uuid",
  "is_duplicate": true,
  "duplicate_of_id": "original_uuid",
  "similarity_score": 0.87
}
```

## Test Role-Based Access

### Citizen Cannot Update Status

```bash
curl -X PUT "http://localhost:8000/api/v1/grievances/{grievance_id}/status" \
  -H "Authorization: Bearer YOUR_CITIZEN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "resolved"}'
```

**Response (403 Forbidden):**
```json
{
  "detail": "Only officers can update grievance status"
}
```

### Officer Cannot See Other's Grievances

Submit grievance as Citizen A, login as Officer B, try to access:

```bash
curl -X GET "http://localhost:8000/api/v1/grievances/{grievance_id}/timeline" \
  -H "Authorization: Bearer OFFICER_B_TOKEN"
```

**Response (403 Forbidden):**
```json
{
  "detail": "Not authorized"
}
```

## Test List Grievances with Filters

### List by Status

```bash
curl -X GET "http://localhost:8000/api/v1/grievances/?status=under_review" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Officer List with Urgency Filter

```bash
curl -X GET "http://localhost:8000/api/v1/officers/me/assigned?urgency_filter=high" \
  -H "Authorization: Bearer YOUR_OFFICER_TOKEN"
```

### With Pagination

```bash
curl -X GET "http://localhost:8000/api/v1/grievances/?skip=0&limit=5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Test Error Scenarios

### Invalid Token

```bash
curl -X GET "http://localhost:8000/api/v1/auth/me" \
  -H "Authorization: Bearer invalid_token"
```

**Response (401 Unauthorized):**
```json
{
  "detail": "Invalid or expired token"
}
```

### Grievance Not Found

```bash
curl -X GET "http://localhost:8000/api/v1/grievances/invalid-id" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (404 Not Found):**
```json
{
  "detail": "Grievance not found"
}
```

### Invalid Status

```bash
curl -X PUT "http://localhost:8000/api/v1/grievances/{grievance_id}/status" \
  -H "Authorization: Bearer YOUR_OFFICER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "invalid_status"}'
```

**Response (422 Unprocessable Entity):**
```json
{
  "detail": "Invalid status"
}
```

## Performance Testing

### Load Testing with Apache Bench

```bash
# Test /api/v1/health endpoint
ab -n 100 -c 10 http://localhost:8000/api/v1/health
```

### Load Testing with wrk

```bash
# Test with token
wrk -t4 -c100 -d30s \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/grievances/
```

## End-to-End Workflow Test Script

Create `test_workflow.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:8000/api/v1"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "=== Smart Griev E2E Test ==="

# 1. Register Citizen
echo "1. Registering citizen..."
CITIZEN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test_citizen@example.com",
    "password": "TestPass@123",
    "full_name": "Test Citizen",
    "role": "citizen"
  }')
echo $CITIZEN_RESPONSE

# 2. Login Citizen
echo -e "\n2. Logging in citizen..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test_citizen@example.com",
    "password": "TestPass@123"
  }')
CITIZEN_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')
echo "Token: $CITIZEN_TOKEN"

# 3. Submit Grievance
echo -e "\n3. Submitting grievance..."
GRIEVANCE_RESPONSE=$(curl -s -X POST "$BASE_URL/grievances/submit" \
  -H "Authorization: Bearer $CITIZEN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Water supply failure",
    "description": "No water supply for 3 days. Critical issue."
  }')
GRIEVANCE_ID=$(echo $GRIEVANCE_RESPONSE | jq -r '.grievance_id')
echo "Grievance ID: $GRIEVANCE_ID"

# 4. Get Grievance Details
echo -e "\n4. Getting grievance details..."
curl -s -X GET "$BASE_URL/grievances/$GRIEVANCE_ID" \
  -H "Authorization: Bearer $CITIZEN_TOKEN" | jq '.'

# 5. Get Timeline
echo -e "\n5. Getting timeline..."
curl -s -X GET "$BASE_URL/grievances/$GRIEVANCE_ID/timeline" \
  -H "Authorization: Bearer $CITIZEN_TOKEN" | jq '.'

echo -e "\n${GREEN}E2E Test Completed!${NC}"
```

Run it:

```bash
chmod +x test_workflow.sh
./test_workflow.sh
```

## Automated Testing

### Run Unit Tests

```bash
pytest tests/ -v
```

### Run with Coverage

```bash
pytest tests/ --cov=app --cov-report=html
```

### Run Specific Test

```bash
pytest tests/test_auth.py::test_login_success -v
```

## Troubleshooting

### Database Connection Error

```
Error: could not connect to database
```

Solution:
1. Ensure PostgreSQL is running
2. Check DATABASE_URL in .env
3. Verify credentials

### Token Expired

```
{
  "detail": "Invalid or expired token"
}
```

Solution: Get new token with login endpoint

### Departments Not Found

When submitting grievance:
```
{
  "detail": "No suitable department found"
}
```

Solution: Ensure departments are created in database

## Performance Metrics

### Expected Response Times

- Health check: < 10ms
- Register: 50-100ms
- Login: 100-150ms
- Submit grievance: 200-300ms
- List grievances: 50-200ms (depending on count)

### Database Indexes

The system uses indexes on:
- grievances(citizen_id, status)
- grievances(officer_id, status)
- grievances(department_id, status)
- grievances(created_at)
- timeline_events(grievance_id, created_at)

These should be created automatically with migrations.

## Next Steps

1. Test all endpoints with provided curl commands
2. Run automated test suite
3. Monitor logs for errors
4. Test with frontend application
5. Load test before production deployment

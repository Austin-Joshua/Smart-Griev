"""Tests for grievance endpoints"""

import pytest
from fastapi import status
from app.models.department import Department
from uuid import uuid4


@pytest.fixture
def auth_headers(client, test_user_data):
    """Get authentication headers for test user"""
    client.post("/api/v1/auth/register", json=test_user_data)
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": test_user_data["email"],
            "password": test_user_data["password"]
        }
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def test_department(db):
    """Create a test department"""
    dept = Department(
        name="Water Department",
        code="water",
        description="Handles water supply issues",
        email="water@example.com",
        categories="water_supply",
        max_capacity=100,
        current_load=0
    )
    db.add(dept)
    db.commit()
    return dept


def test_submit_grievance_success(client, test_user_data, test_grievance_data, auth_headers, db, test_department):
    """Test successful grievance submission"""
    response = client.post(
        "/api/v1/grievances/submit",
        json=test_grievance_data,
        headers=auth_headers
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["success"] == True
    assert "grievance_id" in data
    assert data["status"] == "submitted"
    assert data["urgency"] in ["low", "medium", "high", "critical"]


def test_submit_grievance_too_long(client, test_user_data, auth_headers):
    """Test submitting grievance with description too long"""
    long_description = "x" * 6000
    
    response = client.post(
        "/api/v1/grievances/submit",
        json={
            "title": "Test",
            "description": long_description
        },
        headers=auth_headers
    )
    
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_get_citizen_grievances(client, test_user_data, test_grievance_data, auth_headers, db, test_department):
    """Test listing citizen's grievances"""
    # Submit grievance
    submit_response = client.post(
        "/api/v1/grievances/submit",
        json=test_grievance_data,
        headers=auth_headers
    )
    assert submit_response.status_code == status.HTTP_200_OK
    
    # List grievances
    response = client.get(
        "/api/v1/grievances/?skip=0&limit=10",
        headers=auth_headers
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["total"] >= 1
    assert len(data["items"]) >= 1


def test_get_grievance_details(client, test_user_data, test_grievance_data, auth_headers, db, test_department):
    """Test getting grievance details"""
    # Submit grievance
    submit_response = client.post(
        "/api/v1/grievances/submit",
        json=test_grievance_data,
        headers=auth_headers
    )
    grievance_id = submit_response.json()["grievance_id"]
    
    # Get grievance
    response = client.get(
        f"/api/v1/grievances/{grievance_id}",
        headers=auth_headers
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == grievance_id
    assert data["title"] == test_grievance_data["title"]


def test_get_grievance_timeline(client, test_user_data, test_grievance_data, auth_headers, db, test_department):
    """Test getting grievance timeline"""
    # Submit grievance
    submit_response = client.post(
        "/api/v1/grievances/submit",
        json=test_grievance_data,
        headers=auth_headers
    )
    grievance_id = submit_response.json()["grievance_id"]
    
    # Get timeline
    response = client.get(
        f"/api/v1/grievances/{grievance_id}/timeline",
        headers=auth_headers
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["grievance_id"] == grievance_id
    assert data["total_events"] >= 1


def test_add_comment(client, test_user_data, test_grievance_data, auth_headers, db, test_department):
    """Test adding comment to grievance"""
    # Submit grievance
    submit_response = client.post(
        "/api/v1/grievances/submit",
        json=test_grievance_data,
        headers=auth_headers
    )
    grievance_id = submit_response.json()["grievance_id"]
    
    # Add comment
    response = client.post(
        f"/api/v1/grievances/{grievance_id}/comment",
        json={"comment": "This is a test comment"},
        headers=auth_headers
    )
    
    assert response.status_code == status.HTTP_200_OK

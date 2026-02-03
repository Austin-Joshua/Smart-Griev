"""Tests for authentication endpoints"""

import pytest
from fastapi import status


def test_register_user(client, test_user_data):
    """Test user registration"""
    response = client.post("/api/v1/auth/register", json=test_user_data)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == test_user_data["email"]
    assert data["full_name"] == test_user_data["full_name"]
    assert data["role"] == "citizen"
    assert "id" in data


def test_register_duplicate_email(client, test_user_data, db):
    """Test registering with duplicate email"""
    # Register first user
    response1 = client.post("/api/v1/auth/register", json=test_user_data)
    assert response1.status_code == status.HTTP_200_OK
    
    # Try to register with same email
    response2 = client.post("/api/v1/auth/register", json=test_user_data)
    assert response2.status_code == status.HTTP_400_BAD_REQUEST


def test_login_success(client, test_user_data):
    """Test successful login"""
    # Register
    client.post("/api/v1/auth/register", json=test_user_data)
    
    # Login
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": test_user_data["email"],
            "password": test_user_data["password"]
        }
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_password(client, test_user_data):
    """Test login with invalid password"""
    # Register
    client.post("/api/v1/auth/register", json=test_user_data)
    
    # Login with wrong password
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": test_user_data["email"],
            "password": "wrongpassword"
        }
    )
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_get_current_user(client, test_user_data):
    """Test getting current user info"""
    # Register and login
    client.post("/api/v1/auth/register", json=test_user_data)
    login_response = client.post(
        "/api/v1/auth/login",
        json={
            "email": test_user_data["email"],
            "password": test_user_data["password"]
        }
    )
    
    token = login_response.json()["access_token"]
    
    # Get current user
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == test_user_data["email"]

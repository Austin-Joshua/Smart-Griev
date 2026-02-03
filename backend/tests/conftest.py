"""Pytest configuration and fixtures"""

import pytest
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from app.main import app
from app.db.base import Base
from app.db.session import get_db
from app.core.config import settings


# Test database
TEST_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override database dependency for tests"""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


@pytest.fixture(autouse=True)
def setup_database():
    """Create tables before each test"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db():
    """Database session fixture"""
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client(db):
    """FastAPI test client"""
    app.dependency_overrides[get_db] = lambda: db
    
    yield TestClient(app)
    
    app.dependency_overrides.clear()


@pytest.fixture
def test_user_data():
    """Test user data"""
    return {
        "email": "test@example.com",
        "password": "testpass123",
        "full_name": "Test User",
        "phone": "+1234567890",
        "role": "citizen"
    }


@pytest.fixture
def test_officer_data():
    """Test officer data"""
    return {
        "email": "officer@example.com",
        "password": "officerpass123",
        "full_name": "Officer User",
        "role": "officer"
    }


@pytest.fixture
def test_grievance_data():
    """Test grievance data"""
    return {
        "title": "Water supply issue",
        "description": "No water supply in the area for 3 days. Please resolve ASAP."
    }

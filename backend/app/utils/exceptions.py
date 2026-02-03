"""Custom exception classes"""

from fastapi import HTTPException, status


class APIException(HTTPException):
    """Base API exception"""
    
    def __init__(self, message: str, status_code: int = 400):
        super().__init__(status_code=status_code, detail=message)


class ValidationError(APIException):
    """Validation error exception"""
    
    def __init__(self, message: str):
        super().__init__(message, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)


class NotFoundError(APIException):
    """Resource not found exception"""
    
    def __init__(self, resource: str = "Resource"):
        super().__init__(
            message=f"{resource} not found",
            status_code=status.HTTP_404_NOT_FOUND
        )


class UnauthorizedError(APIException):
    """Unauthorized access exception"""
    
    def __init__(self, message: str = "Unauthorized"):
        super().__init__(
            message=message,
            status_code=status.HTTP_401_UNAUTHORIZED
        )


class ForbiddenError(APIException):
    """Forbidden access exception"""
    
    def __init__(self, message: str = "Forbidden"):
        super().__init__(
            message=message,
            status_code=status.HTTP_403_FORBIDDEN
        )

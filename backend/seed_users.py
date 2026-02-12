
from app.db.session import SessionLocal
from app.services.auth_service import AuthService
from app.schemas.user import UserCreate
from app.models.user import User, UserRole
import logging

# Configure logging
logging.basicConfig(level=logging.WARNING)
logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)

logger = logging.getLogger(__name__)


def seed_users():
    print("Starting user seeding...")
    db = SessionLocal()
    try:
        from app.core.security import get_password_hash
        
        users_to_seed = [
            ("admin@smartgriev.com", "System Admin", UserRole.ADMIN),
            ("officer@smartgriev.com", "Officer John", UserRole.OFFICER),
            ("citizen@smartgriev.com", "Jane Doe", UserRole.CITIZEN),
        ]
        
        for email, name, role in users_to_seed:
            user = db.query(User).filter(User.email == email).first()
            if not user:
                print(f"Creating {role} user: {email}...")
                AuthService.register_user(db, UserCreate(
                    email=email,
                    password="password123",
                    full_name=name,
                    role=role
                ))
            else:
                print(f"Updating password for {email}...")
                user.password_hash = get_password_hash("password123")
                user.is_active = True
                user.role = role # Ensure role is correct
                db.commit()
                
        # Final Verification
        print("\nVerifying all seeded users...")
        from app.core.security import verify_password
        all_ok = True
        for email, _, _ in users_to_seed:
            u = db.query(User).filter(User.email == email).first()
            if u and verify_password("password123", u.password_hash):
                print(f"SUCCESS: {email} password verified.")
            else:
                print(f"FAILURE: {email} verification failed.")
                all_ok = False
        
        if all_ok:
            print("\nALL USERS SEEDED AND VERIFIED.")
            with open("verification_result.txt", "w") as f:
                f.write("SUCCESS")
        else:
            with open("verification_result.txt", "w") as f:
                f.write("FAILURE")

    except Exception as e:
        print(f"CRITICAL ERROR SEEDING USERS: {e}")
    finally:
        print("Finished seeding process.")
        db.close()

if __name__ == "__main__":
    seed_users()

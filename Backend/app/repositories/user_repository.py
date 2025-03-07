from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.models import User
from app.models.schemas import UserCreate, UserUpdate
from app.repositories.base import BaseRepository
from app.utils.security import get_password_hash

class UserRepository(BaseRepository[User, UserCreate, UserUpdate]):
    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()
    
    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        db_obj = User(
            name=obj_in.name,
            location=obj_in.location,
            contact_number=obj_in.contact_number,
            email=obj_in.email,
            password=get_password_hash(obj_in.password),
            role=obj_in.role
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

# Create instance
user_repository = UserRepository(User)
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.schemas import UserCreate, UserUpdate, User
from app.repositories.user_repository import user_repository

def create_user(db: Session, user_data: UserCreate) -> User:
    # Check if email already exists
    existing_user = user_repository.get_by_email(db, email=user_data.email)
    if existing_user:
        raise ValueError("Email already registered")
    
    return user_repository.create(db, obj_in=user_data)

def get_user(db: Session, user_id: int) -> Optional[User]:
    return user_repository.get(db, id=user_id)

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return user_repository.get_by_email(db, email=email)

def update_user(db: Session, user_id: int, user_data: UserUpdate) -> Optional[User]:
    db_user = user_repository.get(db, id=user_id)
    if not db_user:
        return None
    
    return user_repository.update(db, db_obj=db_user, obj_in=user_data)

def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    return user_repository.get_multi(db, skip=skip, limit=limit)
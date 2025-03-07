from datetime import datetime, timedelta
from typing import Optional
from jose import jwt, JWTError
from app.core.config.settings import settings
from app.models.schemas import TokenPayload, User
from app.utils.security import verify_password
from app.repositories.user_repository import user_repository
from sqlalchemy.orm import Session
import time

def create_access_token(*, data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm="HS256"
    )
    return encoded_jwt

def create_refresh_token(*, data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm="HS256"
    )
    return encoded_jwt

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    user = user_repository.get_by_email(db, email=email)
    if not user:
        return None
    if not verify_password(password, user.password):
        return None
    return user

def get_current_user(db: Session, token: str) -> Optional[User]:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=["HS256"]
        )
        token_data = TokenPayload(**payload)
        if datetime.fromtimestamp(token_data.exp) < datetime.now():
            return None
    except JWTError:
        return None
    
    user = user_repository.get_by_email(db, email=token_data.sub)
    if user is None:
        return None
    return user

def refresh_token(db: Session, refresh_token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(
            refresh_token, settings.SECRET_KEY, algorithms=["HS256"]
        )
        token_data = TokenPayload(**payload)
        if datetime.fromtimestamp(token_data.exp) < datetime.now():
            return None
    except JWTError:
        return None
    
    user = user_repository.get_by_email(db, email=token_data.sub)
    if user is None:
        return None
    
    access_token = create_access_token(data={"sub": user.email})
    new_refresh_token = create_refresh_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }
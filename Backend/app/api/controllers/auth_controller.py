from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.models.schemas import Token, UserCreate, User, LoginRequest
from app.services.auth_service import authenticate_user, create_access_token, create_refresh_token, refresh_token
from app.services.user_service import create_user, get_user_by_email
from datetime import timedelta
from app.core.config.settings import settings

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

@router.post("/login", response_model=Token)
def login(
    form_data: LoginRequest,
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.email, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    refresh_token_str = create_refresh_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token_str,
        "token_type": "bearer"
    }

@router.post("/signup", response_model=User)
def signup(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    existing_user = get_user_by_email(db, email=user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    user = create_user(db, user_data)
    return user

@router.post("/refresh", response_model=Token)
def refresh_access_token(
    refresh_token_str: str,
    db: Session = Depends(get_db)
):
    tokens = refresh_token(db, refresh_token_str)
    if not tokens:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return tokens

@router.post("/logout")
def logout():
    # In a stateless JWT-based auth system, client simply discards the tokens
    # For a more secure implementation, we could blacklist tokens
    return {"detail": "Successfully logged out"}
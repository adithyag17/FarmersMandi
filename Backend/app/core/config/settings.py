from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Settings(BaseSettings):
    # API Settings
    API_V1_PREFIX: str = os.getenv("API_V1_PREFIX", "/api/v1")
    DEBUG: bool = os.getenv("DEBUG", "True") == "True"
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "Farmers Mandi API")
    
    # Database Settings
    DB_NAME: str = os.getenv("DB_NAME", "neondb")
    DB_USER: str = os.getenv("DB_USER", "neondb_owner")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "")
    DB_HOST: str = os.getenv("DB_HOST", "")
    DB_PORT: str = os.getenv("DB_PORT", "5432")
    DB_SSLMODE: str = os.getenv("DB_SSLMODE", "require")
    
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}?sslmode={self.DB_SSLMODE}"
    
    # JWT Settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
    
    # Payment Gateway Settings
    PAYMENT_GATEWAY_API_KEY: Optional[str] = os.getenv("PAYMENT_GATEWAY_API_KEY")
    PAYMENT_GATEWAY_SECRET: Optional[str] = os.getenv("PAYMENT_GATEWAY_SECRET")

    class Config:
        env_file = ".env"
        case_sensitive = True

# Create instance of settings
settings = Settings()
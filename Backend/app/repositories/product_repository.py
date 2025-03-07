from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.models import Product
from app.models.schemas import ProductCreate, ProductUpdate
from app.repositories.base import BaseRepository

class ProductRepository(BaseRepository[Product, ProductCreate, ProductUpdate]):
    def get_by_id(self, db: Session, *, product_id: int) -> Optional[Product]:
        return db.query(Product).filter(Product.product_id == product_id).first()
    
    def get_by_category(self, db: Session, *, category: str, skip: int = 0, limit: int = 100) -> List[Product]:
        return db.query(Product).filter(Product.product_category == category).offset(skip).limit(limit).all()
    
    def search(self, db: Session, *, query: str, skip: int = 0, limit: int = 100) -> List[Product]:
        search_query = f"%{query}%"
        return db.query(Product).filter(
            or_(
                Product.product_name.ilike(search_query),
                Product.product_description.ilike(search_query),
                Product.product_category.ilike(search_query)
            )
        ).offset(skip).limit(limit).all()

# Create instance
product_repository = ProductRepository(Product)
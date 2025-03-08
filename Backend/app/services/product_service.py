from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.schemas import ProductCreate, ProductUpdate, Product
from app.repositories.product_repository import product_repository

def create_product(db: Session, product_data: ProductCreate) -> Product:
    return product_repository.create(db, obj_in=product_data)

def get_product(db: Session, product_id: int) -> Optional[Product]:
    return product_repository.get_by_id(db, product_id=product_id)

def get_product_price(db: Session, product_id: int) -> Optional[float]:
    product = get_product(db, product_id)
    return product.product_price

def update_product(db: Session, product_id: int, product_data: ProductUpdate) -> Optional[Product]:
    db_product = product_repository.get_by_id(db, product_id=product_id)
    if not db_product:
        return None
    
    return product_repository.update(db, db_obj=db_product, obj_in=product_data)

def delete_product(db: Session, product_id: int) -> Optional[Product]:
    db_product = product_repository.get_by_id(db, product_id=product_id)
    if not db_product:
        return None
    
    return product_repository.remove(db, id=product_id)

def get_products(db: Session, skip: int = 0, limit: int = 100) -> List[Product]:
    return product_repository.get_multi(db, skip=skip, limit=limit)

def get_products_by_category(db: Session, category: str, skip: int = 0, limit: int = 100) -> List[Product]:
    return product_repository.get_by_category(db, category=category, skip=skip, limit=limit)

def search_products(db: Session, query: str, skip: int = 0, limit: int = 100) -> List[Product]:
    return product_repository.search(db, query=query, skip=skip, limit=limit)
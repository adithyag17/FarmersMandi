from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.base import get_db
from app.models.schemas import Product, ProductCreate, ProductUpdate
from app.services.product_service import (
    get_products, get_product, create_product, update_product, 
    delete_product, get_products_by_category, search_products
)
from app.api.controllers.auth_controller import oauth2_scheme
from app.services.auth_service import get_current_user

router = APIRouter()

@router.get("/", response_model=List[Product])
def read_products(
    skip: int = 0, 
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get list of products.
    """
    products = get_products(db, skip=skip, limit=limit)
    return products

@router.get("/search", response_model=List[Product])
def search_products_endpoint(
    query: str,
    skip: int = 0, 
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Search for products using a text query.
    """
    products = search_products(db, query=query, skip=skip, limit=limit)
    return products

@router.get("/category/{category}", response_model=List[Product])
def read_products_by_category(
    category: str,
    skip: int = 0, 
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get products by category.
    """
    products = get_products_by_category(db, category=category, skip=skip, limit=limit)
    return products

@router.get("/{product_id}", response_model=Product)
def read_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific product by ID.
    """
    product = get_product(db, product_id=product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/", response_model=Product, status_code=status.HTTP_201_CREATED)
def create_product_endpoint(
    product_data: ProductCreate,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    Create a new product (admin only).
    """
    current_user = get_current_user(db, token)
    if not current_user or current_user.role != 1:  # Admin role check
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied"
        )
    
    return create_product(db, product_data)

@router.put("/{product_id}", response_model=Product)
def update_product_endpoint(
    product_id: int,
    product_data: ProductUpdate,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    Update a product (admin only).
    """
    current_user = get_current_user(db, token)
    if not current_user or current_user.role != 1:  # Admin role check
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied"
        )
    
    product = update_product(db, product_id, product_data)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.delete("/{product_id}", response_model=Product)
def delete_product_endpoint(
    product_id: int,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    Delete a product (admin only).
    """
    current_user = get_current_user(db, token)
    if not current_user or current_user.role != 1:  # Admin role check
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied"
        )
    
    product = delete_product(db, product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.schemas import CartCreate, CartUpdate, Cart, CartItemBase
from app.repositories.cart_repository import cart_repository

def get_user_cart(db: Session, user_id: int) -> Optional[Cart]:
    return cart_repository.get_by_user(db, user_id=user_id)

def create_or_update_cart(db: Session, user_id: int, items: List[CartItemBase]) -> Cart:
    existing_cart = cart_repository.get_by_user(db, user_id=user_id)
    
    if existing_cart:
        cart_update = CartUpdate(products=items)
        return cart_repository.update(db, db_obj=existing_cart, obj_in=cart_update)
    else:
        cart_create = CartCreate(user_id=user_id, products=items)
        return cart_repository.create(db, obj_in=cart_create)


def clear_cart(db: Session, user_id: int) -> bool:
    return cart_repository.clear_cart(db, user_id=user_id)

def remove_item_from_cart(db: Session, user_id: int, product_id: int) -> Cart:
    existing_cart = cart_repository.get_by_user(db, user_id=user_id)
    
    if not existing_cart:
        return None  # Cart not found
    
    return cart_repository.remove_item(db, db_obj=existing_cart, product_id=product_id)

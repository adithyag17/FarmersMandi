from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.models import Cart
from app.models.schemas import CartCreate, CartUpdate
from app.repositories.base import BaseRepository
import json
from datetime import datetime, timedelta

class CartRepository(BaseRepository[Cart, CartCreate, CartUpdate]):
    def get_by_user(self, db: Session, *, user_id: int) -> Optional[Cart]:
        return db.query(Cart).filter(Cart.user_id == user_id).first()
    
    def create(self, db: Session, *, obj_in: CartCreate) -> Cart:
        # Convert products list to JSON
        products_json = [item.dict() for item in obj_in.products]
        # Set expiry to 7 days
        expires_at = datetime.now() + timedelta(days=7)
        
        db_obj = Cart(
            user_id=obj_in.user_id,
            products=products_json,
            expires_at=expires_at
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def clear_cart(self, db: Session, *, user_id: int) -> bool:
        cart = self.get_by_user(db, user_id=user_id)
        if cart:
            cart.products = []
            db.add(cart)
            db.commit()
            return True
        return False

# Create instance
cart_repository = CartRepository(Cart)
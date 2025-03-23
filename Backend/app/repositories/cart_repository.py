from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.models import Cart
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm.attributes import flag_modified
from app.models.schemas import CartCreate, CartUpdate, CartItemBase
from app.repositories.base import BaseRepository
from datetime import datetime, timedelta

class CartRepository(BaseRepository[Cart, CartCreate, CartUpdate]):
    def get_by_user(self, db: Session, *, user_id: int) -> Optional[Cart]:
        return db.query(Cart).filter(Cart.user_id == user_id).first()
    
    def create(self, db: Session, *, obj_in: CartCreate) -> Cart:
        # Convert products list to list of dictionaries for JSONB
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
    
    

    def update(self, db: Session, *, db_obj: Cart, obj_in: CartUpdate) -> Cart:
        # Ensure products is a list
        existing_products = db_obj.products if isinstance(db_obj.products, list) else []

        # Create a dictionary for fast lookup of existing products
        product_map = {item['product_id']: item for item in existing_products}

        # Replace existing products with new ones
        for new_item in obj_in.products:
            item_dict = new_item.dict()
            product_id = item_dict['product_id']
            product_map[product_id] = item_dict  # Replace instead of adding quantity

        # Convert back to list
        db_obj.products = list(product_map.values())

        # Mark column as modified for SQLAlchemy
        flag_modified(db_obj, "products")

        # Reset expiry
        db_obj.expires_at = datetime.now() + timedelta(days=7)

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

    def remove_item(self, db: Session, *, db_obj: Cart, product_id: int) -> Cart:
        # Ensure products is a list
        existing_products = db_obj.products if isinstance(db_obj.products, list) else []

        # Filter out the product to be removed
        updated_products = [item for item in existing_products if item["product_id"] != product_id]

        # Update the cart
        db_obj.products = updated_products

        # Mark column as modified for SQLAlchemy
        flag_modified(db_obj, "products")

        # Reset expiry
        db_obj.expires_at = datetime.now() + timedelta(days=7)

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

# Create instance
cart_repository = CartRepository(Cart)
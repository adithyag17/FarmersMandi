from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.schemas import OrderCreate, Order
from app.services.cart_service import get_user_cart, clear_cart
from app.services.user_service import get_user_address
from app.services.product_service import get_product_price
from app.repositories.order_repository import order_repository
from app.repositories.product_repository import product_repository
from app.services.cart_service import clear_cart

def create_order(db: Session, user_id: int) -> Optional[Order]:
    cart = get_user_cart(db, user_id)
    
    if not cart or not cart.products:
        return None  # Return None if cart is empty
    
    delivery_address = get_user_address(db, user_id)
    if not delivery_address:
        return None
    
    total_price = 0
    for product in cart.products:
        product_id = product["product_id"]
        
        # Check if product_name exists in the product data
        # If not, fetch it from the database
        if product["product_name"] == None:
            # Fetch product details to get the name
            product_details = product_repository.get_by_id(db, product_id=product_id)
            if product_details:
                product["product_name"] = product_details.product_name
            else:
                # Default name if product not found
                product["product_name"] = f"Product {product_id}"
        
        product_price = get_product_price(db, product_id)
        total_price += product_price * product["quantity"]
        product["price"] = product_price

    order_data = OrderCreate(
        user_id=user_id,
        products=cart.products,
        total_order_price=total_price,
        delivery_address=delivery_address
    )
    
    order = order_repository.create(db, obj_in=order_data)
    clear_cart(db, user_id)
    
    return order

def get_order(db: Session, order_id: int) -> Optional[Order]:
    return order_repository.get_by_id(db, order_id=order_id)

def get_all_orders(db: Session) -> Optional[Order]:
    return order_repository.get_all_order(db)

def get_user_orders(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Order]:
    return order_repository.get_by_user(db, user_id=user_id, skip=skip, limit=limit)

def update_order_status(db: Session, order_id: int, status: int) -> Optional[Order]:
    return order_repository.update_status(db, order_id=order_id, status=status)

def process_payment(db: Session, order_id: int, payment_details: Dict[str, Any]) -> Optional[Order]:
    order = order_repository.get_by_id(db, order_id=order_id)
    
    if not order:
        return None
    
    # Update payment details
    order.payment_details = payment_details
    
    # If payment successful, update order status to 1 (Successful)
    if payment_details.get("status") == "success":
        order.order_status = 1
    else:
        # If payment failed, update order status to 0 (Failed)
        order.order_status = 0
    
    # Save changes
    db.add(order)
    db.commit()
    db.refresh(order)
    
    return order
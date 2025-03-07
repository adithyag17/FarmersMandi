from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.schemas import OrderCreate, Order, OrderItemBase
from app.repositories.order_repository import order_repository
from app.services.cart_service import clear_cart

def create_order(db: Session, user_id: int, products: List[OrderItemBase], 
                 total_price: int, delivery_address: str) -> Order:
    order_data = OrderCreate(
        user_id=user_id,
        products=products,
        total_order_price=total_price,
        delivery_address=delivery_address
    )
    
    # Create the order
    order = order_repository.create(db, obj_in=order_data)
    
    # Clear the user's cart
    clear_cart(db, user_id=user_id)
    
    return order

def get_order(db: Session, order_id: int) -> Optional[Order]:
    return order_repository.get_by_id(db, order_id=order_id)

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
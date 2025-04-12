from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.models import Order
from app.models.schemas import OrderCreate, OrderStatusUpdate
from app.repositories.base import BaseRepository

class OrderRepository(BaseRepository[Order, OrderCreate, OrderStatusUpdate]):
    def get_by_id(self, db: Session, *, order_id: int) -> Optional[Order]:
        return db.query(Order).filter(Order.order_id == order_id).first()
    
    def get_by_user(self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100) -> List[Order]:
        return db.query(Order).filter(Order.user_id == user_id).offset(skip).limit(limit).all()
    
    def create(self, db: Session, *, obj_in: OrderCreate) -> Order:
        # Convert products list to JSON
        products_json = [item.dict() for item in obj_in.products]
        
        db_obj = Order(
            user_id=obj_in.user_id,
            products=products_json,
            total_order_price=obj_in.total_order_price,
            delivery_address=obj_in.delivery_address,
            order_status=2,  # Default to In Progress
            payment_details={}  # Empty payment details
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def update_status(self, db: Session, *, order_id: int, status: int) -> Optional[Order]:
        order = self.get_by_id(db, order_id=order_id)
        if order:
            order.order_status = status
            db.add(order)
            db.commit()
            db.refresh(order)
            return order
        return None
    
    def get_all_order(self, db: Session) -> List[Order]:
        try:
            orders = db.query(Order).all()
            print(orders)
            return orders
        except Exception as e:
            print(f"Error while fetching orders: {e}")
            return []


# Create instance
order_repository = OrderRepository(Order)
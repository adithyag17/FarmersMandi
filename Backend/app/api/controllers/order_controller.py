from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.base import get_db
from app.models.schemas import Order, OrderItemBase, OrderStatusUpdate, PaymentRequest, PaymentResponse
from app.services.order_service import create_order, get_order, get_user_orders, update_order_status, process_payment, get_all_orders
from app.services.payment_service import payment_service
from app.api.controllers.auth_controller import oauth2_scheme
from app.services.auth_service import get_current_user
# from app.services.mail_service import generate_email_body,send_order_email
from app.models.models import Product


router = APIRouter()

@router.post("/", response_model=Order, status_code=status.HTTP_201_CREATED)
def create_new_order(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    Create a new order from the current cart contents.
    """
    current_user = get_current_user(db, token)
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

    order = create_order(db, user_id=current_user.id)
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cart is empty or user address not found"
        )
    # email_body = generate_email_body(order)
    # send_order_email(email_body,'adithya.ganesh39@gmail.com','Farmers Mandi',current_user.email)
    return order

  # your existing DB fetch function

@router.get("/", response_model=List[Order])
def read_user_orders(
    skip: int = 0,
    limit: int = 100,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    Get current user's orders with product_name injected in each product.
    """
    current_user = get_current_user(db, token)
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    # Step 1: Fetch user orders (each has products: List[Dict])
    orders = get_user_orders(db, user_id=current_user.id, skip=skip, limit=limit)

    # Step 2: Collect all unique product_ids from all orders
    product_ids = set()
    for order in orders:
        for item in order.products:
            product_ids.add(item["product_id"])

    # Step 3: Query products and build map: product_id -> product_name
    product_map = {
        product.product_id: product.product_name
        for product in db.query(Product.product_id, Product.product_name)
        .filter(Product.product_id.in_(product_ids))
        .all()
    }

    # Step 4: Enrich each product in each order with product_name
    for order in orders:
        for item in order.products:
            item["product_name"] = product_map.get(item["product_id"], "Unknown")

    return orders


@router.get("/all", response_model=List[Order])
def get_All(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    current_user = get_current_user(db, token)
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    orders = get_all_orders(db)
    return orders

@router.get("/{order_id}", response_model=Order)
def read_order(
    order_id: int,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    Get details of a specific order.
    """
    current_user = get_current_user(db, token)
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    order = get_order(db, order_id=order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Check if user is admin or order belongs to user
    if current_user.role != 1 and order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied"
        )
    
    return order

@router.put("/change-status", response_model=Order)
def update_order_status_endpoint(
    order_id: int,
    status_update: OrderStatusUpdate,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    Update order status (admin only).
    """
    current_user = get_current_user(db, token)
    if not current_user or current_user.role != 1:  # Admin role check
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied"
        )
    
    order = update_order_status(db, order_id=order_id, status=status_update.order_status)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    order = update_order_status(db,order_id,status_update) 
    return order

@router.post("/payment", response_model=PaymentResponse)
def process_payment_endpoint(
    payment_request: PaymentRequest,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    Process payment for an order.
    """
    current_user = get_current_user(db, token)
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    # Check if order exists and belongs to the user
    order = get_order(db, order_id=payment_request.order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    if order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied"
        )
    
    # Process payment (simulated)
    payment_result = payment_service.create_payment(payment_request)
    
    # Update order with payment details
    process_payment(db, order_id=payment_request.order_id, payment_details=payment_result)
    
    return {
        "order_id": payment_request.order_id,
        "payment_id": payment_result["payment_id"],
        "status": payment_result["status"],
        "amount": payment_request.amount
    }
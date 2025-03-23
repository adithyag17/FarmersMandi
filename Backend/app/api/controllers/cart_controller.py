from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.base import get_db
from app.models.schemas import Cart, CartItemBase, RemoveItemRequest
from app.services.cart_service import get_user_cart, create_or_update_cart, clear_cart, remove_item_from_cart
from app.api.controllers.auth_controller import oauth2_scheme
from app.services.auth_service import get_current_user

router = APIRouter()

@router.get("/", response_model=Cart)
def read_cart(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    Get current user's cart.
    """
    current_user = get_current_user(db, token)
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    cart = get_user_cart(db, user_id=current_user.id)
    if not cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart not found"
        )
    
    return cart

@router.post("/", response_model=Cart)
def update_cart(
    items: List[CartItemBase],
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    Update the current user's cart.
    """
    current_user = get_current_user(db, token)
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    cart = create_or_update_cart(db, user_id=current_user.id, items=items)
    return cart

@router.post("/clear", status_code=status.HTTP_204_NO_CONTENT)
def clear_user_cart(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    Clear the current user's cart.
    """
    current_user = get_current_user(db, token)
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    success = clear_cart(db, user_id=current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart not found"
        )
    
    return {None}




@router.post("/remove_item", response_model=Cart)
def remove_cart_item(
    request: RemoveItemRequest,  # Accept JSON payload
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    Remove an item from the user's cart.
    """
    current_user = get_current_user(db, token)
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

    cart = remove_item_from_cart(db, user_id=current_user.id, product_id=request.product_id)
    
    if not cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart not found or product not in cart"
        )
    
    return cart

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
from app.db.base import get_db
from app.services.admin_service import ingest_products_from_excel, generate_sales_report, generate_inventory_report
from app.api.controllers.auth_controller import oauth2_scheme
from app.services.auth_service import get_current_user

router = APIRouter()

@router.post("/IngestProducts")
async def ingest_products(
    file: UploadFile = File(...),
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    Upload an Excel file to add/update products (admin only).
    """
    current_user = get_current_user(db, token)
    if not current_user or current_user.role != 1:  # Admin role check
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied"
        )
    
    # Read the file content
    file_content = await file.read()
    
    # Process the excel file
    result = ingest_products_from_excel(db, file_content)
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["error"]
        )
    
    return result

@router.post("/AuthoriseDelivery/{order_id}")
def authorize_delivery(
    order_id: int,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    Mark an order as delivered (admin only).
    """
    current_user = get_current_user(db, token)
    if not current_user or current_user.role != 1:  # Admin role check
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied"
        )
    
    # Get the order and update its status to delivered (5)
    from app.services.order_service import update_order_status
    order = update_order_status(db, order_id=order_id, status=5)
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    return {"success": True, "message": f"Order {order_id} marked as delivered"}

# @router.get("/reports/sales")
# def get_sales_report(
#     start_date:
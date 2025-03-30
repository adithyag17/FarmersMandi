from typing import List, Dict, Any, Optional
import pandas as pd
from sqlalchemy.orm import Session
from app.models.schemas import ProductCreate, Product
from app.repositories.product_repository import product_repository
from app.repositories.order_repository import order_repository
from io import BytesIO

def ingest_products_from_excel(db: Session, file_content: bytes) -> Dict[str, Any]:
    """
    Process products from an Excel file and add them to the database.
    """
    try:
        # Read Excel file
        excel_data = BytesIO(file_content)
        df = pd.read_excel(excel_data)
        # Transform DataFrame to list of ProductCreate objects
        products_added = 0
        products_updated = 0
        
        for _, row in df.iterrows():
            try:
                existing_product = product_repository.get_by_name(
                db, product_name=row.get('product_name', '')
            )
                
                # Prepare product data
                product_data = {
                    'product_name': row.get('product_name', ''),
                    'product_category': row.get('product_category', ''),
                    'product_description': row.get('product_description', ''),
                    'product_weight': int(row.get('product_weight', 0)),
                    'product_price': int(row.get('product_price', 0)),
                    'stock_quantity': int(row.get('stock_quantity', 0)),
                    'seasonal_availability': bool(row.get('seasonal_availability', False)),
                    'images': row.get('images', '').split(',') if isinstance(row.get('images'), str) else [],
                    'ratings': float(row.get('ratings', 0.0))
                }
                print("hi")
                print(product_data)
                
                if existing_product:
                    # Update existing product
                    product_repository.update(
                        db, 
                        db_obj=existing_product, 
                        obj_in=product_data
                    )
                    products_updated += 1
                else:
                    # Create new product
                    product_create = ProductCreate(**product_data)
                    product_repository.create(db, obj_in=product_create)
                    products_added += 1
                    
            except Exception as e:
                # Continue with next product if there's an error
                continue
                
        return {
            "success": True,
            "products_added": products_added,
            "products_updated": products_updated,
            "total_processed": products_added + products_updated
        }
            
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

def generate_sales_report(db: Session, start_date: str, end_date: str) -> Dict[str, Any]:
    """
    Generate a sales report for a specific date range.
    This is a placeholder implementation.
    """
    # In a real implementation, this would query the database for orders in the date range
    # and generate a detailed report
    
    return {
        "start_date": start_date,
        "end_date": end_date,
        "total_sales": 125000,
        "total_orders": 45,
        "avg_order_value": 2777.78,
        "top_products": [
            {"product_id": 1, "product_name": "Organic Tomatoes", "quantity_sold": 120},
            {"product_id": 5, "product_name": "Fresh Apples", "quantity_sold": 95},
            {"product_id": 3, "product_name": "Organic Potatoes", "quantity_sold": 80}
        ]
    }

def generate_inventory_report(db: Session) -> Dict[str, Any]:
    """
    Generate an inventory report.
    This is a placeholder implementation.
    """
    # In a real implementation, this would query the database for current inventory
    # and provide a detailed report
    
    return {
        "total_products": 55,
        "low_stock_products": 10,
        "out_of_stock_products": 3,
        "total_inventory_value": 235000,
        "inventory_health_score": 85
    }
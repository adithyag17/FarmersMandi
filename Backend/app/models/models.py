from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, TIMESTAMP, JSON, ARRAY
from sqlalchemy.sql import func
from app.db.base import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    location = Column(String)
    contact_number = Column(String)  # Using String to handle international formats
    email = Column(String, unique=True, index=True)
    password = Column(String)  # Storing hashed password
    role = Column(Integer)  # 1: Admin, 2: Customer, 3: Delivery Boy
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class Product(Base):
    __tablename__ = "products"
    
    product_id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String)
    product_category = Column(String)
    product_description = Column(String)
    product_weight = Column(Integer)  # In kilograms
    product_price = Column(Integer)
    stock_quantity = Column(Integer)
    images = Column(ARRAY(String))  # Array of image URLs
    ratings = Column(Float)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class Cart(Base):
    __tablename__ = "carts"
    
    cart_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    products = Column(JSON)  # List of products with quantities
    expires_at = Column(TIMESTAMP)
    created_at = Column(TIMESTAMP, server_default=func.now())

class Order(Base):
    __tablename__ = "orders"
    
    order_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    products = Column(JSON)  # List of products with quantities
    total_order_price = Column(Integer)
    order_status = Column(Integer)  # 1: In-progess, 0: cancelled, 3: delivered 
    delivery_address = Column(String)
    payment_details = Column(JSON)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class OrderHistory(Base):
    __tablename__ = "order_history"
    
    history_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    orders = Column(JSON)  # List of past orders
    created_at = Column(TIMESTAMP, server_default=func.now())
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    name: str
    location: str
    contact_number: str
    email: EmailStr

class UserCreate(UserBase):
    password: str
    role: int = 2  # Default to Customer

class UserUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    contact_number: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[int] = None

class UserInDB(UserBase):
    id: int
    role: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class User(UserInDB):
    pass

# Authentication Schemas
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    sub: str
    exp: int

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Product Schemas
class ProductBase(BaseModel):
    product_name: str
    product_category: str
    product_description: str
    product_weight: int
    product_price: int
    stock_quantity: int
    seasonal_availability: bool
    images: List[str]
    ratings: float = 0.0

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    product_name: Optional[str] = None
    product_category: Optional[str] = None
    product_description: Optional[str] = None
    product_weight: Optional[int] = None
    product_price: Optional[int] = None
    stock_quantity: Optional[int] = None
    seasonal_availability: Optional[bool] = None
    images: Optional[List[str]] = None
    ratings: Optional[float] = None

class ProductInDB(ProductBase):
    product_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class Product(ProductInDB):
    pass

# Cart Schemas
class CartItemBase(BaseModel):
    product_id: int
    quantity: int

class CartBase(BaseModel):
    user_id: int
    products: List[CartItemBase]

class CartCreate(CartBase):
    pass

class CartUpdate(BaseModel):
    products: Optional[List[CartItemBase]] = None

class CartInDB(CartBase):
    cart_id: int
    expires_at: datetime
    created_at: datetime

class CartCleared(BaseModel):
    response: str

    class Config:
        orm_mode = True


class Cart(CartInDB):
    pass


# Order Schemas
class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    price: int

class OrderBase(BaseModel):
    user_id: int
    products: List[OrderItemBase]
    total_order_price: int
    delivery_address: str

class OrderCreate(OrderBase):
    pass

class OrderStatusUpdate(BaseModel):
    order_status: int

class OrderInDB(OrderBase):
    order_id: int
    order_status: int
    payment_details: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class Order(OrderInDB):
    pass

# Order History Schemas
class OrderHistoryBase(BaseModel):
    user_id: int
    orders: List[int]  # List of order IDs

class OrderHistoryCreate(OrderHistoryBase):
    pass

class OrderHistoryInDB(OrderHistoryBase):
    history_id: int
    created_at: datetime

    class Config:
        orm_mode = True

class OrderHistory(OrderHistoryInDB):
    pass

# Payment Schemas
class PaymentRequest(BaseModel):
    order_id: int
    payment_method: str
    amount: int

class PaymentResponse(BaseModel):
    order_id: int
    payment_id: str
    status: str
    amount: int
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import controllers or routers
from app.api.controllers.admin_controller import router as admin_router
from app.api.controllers.auth_controller import router as auth_router
from app.api.controllers.cart_controller import router as cart_router
from app.api.controllers.order_controller import router as order_router
from app.api.controllers.product_controller import router as product_router
from app.api.controllers.user_controller import router as user_router

# Initialize the FastAPI app
app = FastAPI()
origins = [
    "http://localhost:3000",  # React frontend
    "http://localhost:5173",  # Vite default port if you're using Vite
    "https://yourdomain.com",  # Production domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Explicitly allow OPTIONS
    allow_headers=["Content-Type", "Authorization", "Accept"],
)
# Register routes
app.include_router(admin_router, prefix="/admin", tags=["Admin"])
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(cart_router, prefix="/cart", tags=["Cart"])
app.include_router(order_router, prefix="/order", tags=["Order"])
app.include_router(product_router, prefix="/product", tags=["Product"])
app.include_router(user_router, prefix="/user", tags=["User"])

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to Farmers Mandi API!"}

# Entry point
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=process.env.PORT)

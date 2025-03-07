# Farmers Mandi Project

## Overview

The Farmers Mandi project aims to create a platform connecting farmers and consumers through a simplified e-commerce experience. The application will be built with a responsive, mobile-first design and include essential features like product search, cart management, order tracking, and admin controls for inventory management.

## Frontend

**Framework:** Vite React or Next.js (for easy deployment on Vercel)

### Components:

1. **Home Page:** Simple landing page with a "Get Started" button leading to login/signup.
2. **Authentication Page:** Supports Google Auth or in-house sign-up/login.
3. **Product Listing Page:** Displays available items by category.
4. **Product Details & Cart:** Clicking a product opens a card to adjust quantities and proceed to checkout. Includes a search bar for products.
5. **Checkout Page:** Shows product summary, total amount, and a payment button.
6. **Payment Gateway:** Integrate with Razorpay or a cost-effective, reliable alternative.
7. **Order Management:** Admin marks orders as completed or updates order status.
8. **Admin Dashboard:** For adding/updating products, prices, and order management. Includes reporting and analytics features.

## Backend

**Framework:** FastAPI

### API Routes:

- **Auth Routes:**

  - `/auth/login`
  - `/auth/signup`
  - `/auth/logout`
  - `/auth/refresh`

- **User Routes:**

  - `/user/profile`: Manage user profile

- **Product & Search Routes:**

  - `/home`: Fetch home page products
  - `/search/{query}`: Fuzzy, case-insensitive product search with filters and sorting
  - `/categories`: Manage product categories (Admin only)
  - `/inventory`: Manage product stock and availability (Admin only)

- **Cart & Orders:**

  - `/cart`: Get current cart details
  - `/cart/clear`: Clear abandoned carts
  - `/payment`: Handle payment processing with failure and refund handling
  - `/orders/{order_id}`: Get detailed order info
  - `/orders`: Retrieve order history
  - `/orders/{order_id}/status`: Update order status

- **Admin Routes:**
  - `/AuthoriseDelivery`: Mark an order as successfully delivered
  - `/IngestProducts`: Accept products via an Excel upload and add them to the database
  - `/reports`: Generate sales and inventory reports (optional/future)

## Database Schema

### Roles:

- **Admin:** `1`
- **Customer:** `2`
- **Delivery Boy:** `3`

### User Table:

- `id`: Auto-generated (Primary Key)
- `name`: String
- `location`: String
- `contact_number`: Integer
- `email`: Email
- `role`: Integer (FK to roles)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Product Table:

- `product_id`: Integer (Primary Key)
- `product_name`: String
- `product_category`: String
- `product_description`: String
- `product_weight`: Integer (in kgs)
- `product_price`: Integer
- `stock_quantity`: Integer
- `seasonal_availability`: Boolean
- `images`: Array of URLs
- `ratings`: Float
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Cart Table:

- `cart_id`: Integer (Primary Key)
- `user_id`: Integer (FK to user)
- `products`: List of products
- `expires_at`: Timestamp
- `created_at`: Timestamp

### Order Table:

- `order_id`: Integer (Primary Key)
- `user_id`: Integer (FK to user)
- `products`: List of products
- `total_order_price`: Integer
- `order_status`: (`1` - Successful, `0` - Failed, `2` - In Progress, `3` - Processing, `4` - Shipped, `5` - Delivered)
- `delivery_address`: String
- `payment_details`: JSON
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Order History Table:

- `history_id`: Integer (Primary Key)
- `user_id`: Integer (FK to user)
- `orders`: List of past orders
- `created_at`: Timestamp

## Deployment

- **Frontend:** Vercel
- **Backend:** Cloud server or managed service (like AWS EC2 or DigitalOcean)
- **Database:** PostgreSQL

## Security Considerations

- **Auth:** JWT tokens with refresh mechanism
- **Input Validation:** Sanitize and validate all inputs

## Next Steps

- Design UI components
- Set up FastAPI server
- Connect frontend and backend
- Implement authentication and payments
- Test and optimize search functionality

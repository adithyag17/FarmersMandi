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
7. **Order Management:** Admin marks orders as completed.
8. **Admin Dashboard:** For adding/updating products, prices, and order management.

## Backend
**Framework:** FastAPI

### API Routes:
- **Auth Routes:**
  - `/auth/login`
  - `/auth/signup`

- **Product & Search Routes:**
  - `/home`: Fetch home page products
  - `/search/{query}`: Fuzzy, case-insensitive product search

- **Cart & Orders:**
  - `/cart`: Get current cart details
  - `/payment`: Handle payment processing
  - `/orders/{order_id}`: Get detailed order info
  - `/orders`: Retrieve order history

- **Admin Routes:**
  - `/AuthoriseDelivery`: Mark an order as successfully delivered
  - `/IngestProducts`: Accept products via an Excel upload and add them to the database

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

### Product Table:
- `product_id`: Integer (Primary Key)
- `product_name`: String
- `product_weight`: Integer (in kgs)
- `product_price`: Integer

### Order Table:
- `order_id`: Integer (Primary Key)
- `products`: List of products
- `total_order_price`: Integer
- `order_status`: (`1` - Successful, `0` - Failed, `2` - In Progress)

### Cart Table:
- `products`: List of products (modifiable, unlike orders)

### Order History Table:
- `history_id`: Integer (Primary Key)
- `orders`: List of past orders

## Deployment
- **Frontend:** Vercel
- **Backend:** Cloud server or managed service (like AWS EC2 or DigitalOcean)
- **Database:** PostgreSQL or MongoDB

## Next Steps
- Design UI components
- Set up FastAPI server
- Connect frontend and backend
- Implement authentication and payments
- Test and optimize search functionality

Let me know if you want me to refine anything or add more detail! 🚀


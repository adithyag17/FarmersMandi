// src/pages/CartPage.tsx - Updated Frontend

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/pages/CartPage.scss";
import axios from "axios";

// Interface for the product response from API
interface ProductResponse {
  product_id: number;
  product_name: string;
  product_price: number;
  product_category: string;
  product_description: string;
  product_weight: number;
  stock_quantity: number;
  images: string[];
  ratings: number;
  created_at: string;
  updated_at: string;
}

// Modified Product interface to match what our component needs
interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  image: string;
  farmer: string;
  category: string;
  description?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartResponse {
  user_id: number;
  products: {
    product_id: number;
    quantity: number;
  }[];
  cart_id: number;
  expires_at: string;
  created_at: string;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const navigate = useNavigate();
  // API URLs
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const CART_API_URL = `${API_BASE_URL}/cart`;
  const PRODUCT_API_URL = `${API_BASE_URL}/product`;
  const ORDER_API_URL = `${API_BASE_URL}/order`;
  // Function to fetch a single product by ID
  const fetchProductById = async (productId: number) => {
    try {
      const response = await axios.get<ProductResponse>(
        `${PRODUCT_API_URL}/${productId}`
      );
      if (response.status === 401) {
        navigate("/login");
      }
      return response.data;
    } catch (err) {
      console.error(`Error fetching product ${productId}:`, err);
      throw err;
    }
  };

  // Function to map API product response to our Product interface
  const mapProductResponseToProduct = (
    productResponse: ProductResponse
  ): Product => {
    return {
      id: productResponse.product_id,
      name: productResponse.product_name,
      price: productResponse.product_price,
      unit: `${productResponse.product_weight}g`,
      image:
        productResponse.images.length > 0
          ? productResponse.images[0]
          : "placeholder.jpg",
      farmer: "Local Farmer",
      category: productResponse.product_category,
      description: productResponse.product_description,
    };
  };

  // Function to fetch cart items and then fetch product details for each
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      // Get the token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to view your cart");
        setLoading(false);
        return;
      }

      console.log("Fetching cart items from API...");
      const cartResponse = await axios.get<CartResponse>(CART_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Cart API response:", cartResponse.data);
      if (cartResponse.status === 401) {
        navigate("/login");
      }
      // If cart is empty, set empty cart items and return
      if (
        !cartResponse.data.products ||
        cartResponse.data.products.length === 0
      ) {
        setCartItems([]);
        setError(null);
        setLoading(false);
        return;
      }

      // For each product in cart, fetch product details
      const cartItemPromises = cartResponse.data.products.map(async (item) => {
        try {
          const productData = await fetchProductById(item.product_id);
          const mappedProduct = mapProductResponseToProduct(productData);
          return {
            product: mappedProduct,
            quantity: item.quantity,
          };
        } catch (err) {
          console.error(`Failed to fetch product ${item.product_id}`, err);
          return null;
        }
      });

      // Wait for all product fetches to complete
      const fetchedItems = await Promise.all(cartItemPromises);

      // Filter out any null items (failed fetches)
      const validCartItems = fetchedItems.filter(
        (item) => item !== null
      ) as CartItem[];

      setCartItems(validCartItems);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Failed to load cart items. Please try again later.");
      setCartItems([]);
      setLoading(false);
    }
  };

  // Fetch cart items when component mounts
  useEffect(() => {
    fetchCartItems();
  }, []);

  // IMPORTANT: This approach works with the current backend implementation
  const handleQuantityChange = async (
    productId: number,
    newQuantity: number
  ) => {
    if (newQuantity < 0) return;

    try {
      // Get the token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to update your cart");
        return;
      }

      // Update local state first
      const updatedCartItems = cartItems
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
        .filter((item) => item.quantity > 0); // Remove items with zero quantity

      setCartItems(updatedCartItems);

      // Format the complete cart data for the API
      const cartUpdateData = updatedCartItems.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      }));

      // Send the complete cart data to the backend
      const response = await axios.post(CART_API_URL, cartUpdateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 401) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Error updating cart:", err);
      setError("Failed to update cart. Please try again.");
      // Revert to previous state if API call fails
      await fetchCartItems();
    }
  };

  const handleRemoveItem = async (productId: number) => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to update your cart");
        return;
      }

      // Update local state by removing the item
      const updatedCartItems = cartItems.filter(
        (item) => item.product.id !== productId
      );
      setCartItems(updatedCartItems);

      // Send only the product_id to the new /remove_item API
      const response = await axios.post(
        `${CART_API_URL}/remove_item`, // Use the new route
        { product_id: productId }, // Send only product_id
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Error removing item:", err);
      setError("Failed to remove item. Please try again.");

      // Revert to previous state if API call fails
      await fetchCartItems();
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const calculateDeliveryFee = () => {
    // Simple delivery fee calculation
    const subtotal = calculateSubtotal();
    return subtotal > 500 ? 0 : 50; // Free delivery for orders above ₹500
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateDeliveryFee();
  };

  // In the CartPage.tsx file, update the handlePlaceOrder function to include product name:

  const handlePlaceOrder = async () => {
    try {
      setIsSubmittingOrder(true);

      // Get the token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to place an order");
        setIsSubmittingOrder(false);
        return;
      }

      // Prepare order data - format based on the updated cart approach
      const orderItems = cartItems.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name, // Added product name
        quantity: item.quantity,
      }));

      const orderData = {
        items: orderItems,
        delivery_fee: calculateDeliveryFee(),
        total_amount: calculateTotal(),
      };

      console.log("Submitting order:", orderData);

      // Send order to API
      const response = await axios.post(ORDER_API_URL, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Order submission response:", response);
      if (response.status === 401) {
        navigate("/login");
      }
      if (response.status === 201) {
        // Clear the cart
        await handleClearCart();

        // Redirect to the myorders page
        navigate("/myorders");
      }

      setIsSubmittingOrder(false);
    } catch (err) {
      console.error("Error submitting order:", err);
      setError("Failed to place your order. Please try again.");
      setIsSubmittingOrder(false);
    }
  };

  const handleClearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to clear your cart");
        return;
      }

      console.log("Clearing cart...");
      const response = await axios.post(
        `${CART_API_URL}/clear`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 401) {
        navigate("/login");
      }

      setCartItems([]);
      setError(null);
    } catch (err) {
      console.error("Error clearing cart:", err);
      setError("Failed to clear cart. Please try again.");
      await fetchCartItems();
    }
  };

  return (
    <div className="cart-page">
      <Navbar />

      <div className="container">
        <h1 className="page-title">Your Cart</h1>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading cart items...</div>
        ) : cartItems.length > 0 ? (
          <div className="cart-container">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div className="cart-item" key={item.product.id}>
                  <div className="item-image">
                    <img
                      src={"https://iili.io/3IKKRjf.jpg"}
                      alt={item.product.name}
                    />
                  </div>
                  <div className="item-details">
                    <div className="item-info">
                      <h3 className="item-name">{item.product.name}</h3>
                      <p className="item-farmer">by {item.product.farmer}</p>
                      <p className="item-price">
                        ₹{item.product.price}/{item.product.unit}
                      </p>
                    </div>
                    <div className="item-actions">
                      <div className="quantity-controls">
                        <button
                          className="quantity-btn"
                          onClick={() =>
                            handleQuantityChange(
                              item.product.id,
                              item.quantity - 1
                            )
                          }
                          disabled={loading || isSubmittingOrder}
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() =>
                            handleQuantityChange(
                              item.product.id,
                              item.quantity + 1
                            )
                          }
                          disabled={loading || isSubmittingOrder}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveItem(item.product.id)}
                        disabled={loading || isSubmittingOrder}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="item-subtotal">
                      <span>Total: ₹{item.product.price * item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{calculateSubtotal()}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>
                  {calculateDeliveryFee() === 0
                    ? "Free"
                    : `₹${calculateDeliveryFee()}`}
                </span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{calculateTotal()}</span>
              </div>
              <button
                className="place-order-btn"
                onClick={handlePlaceOrder}
                disabled={loading || isSubmittingOrder}
              >
                {isSubmittingOrder ? "Processing..." : "Place Order"}
              </button>
              <button
                className="clear-cart-btn"
                onClick={handleClearCart}
                disabled={loading || isSubmittingOrder}
              >
                Clear Cart
              </button>
              <div className="continue-shopping">
                <Link to="/home">Continue shopping</Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Browse our products and add items to your cart.</p>
            <Link to="/home" className="button primary">
              Start Shopping
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;

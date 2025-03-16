// src/pages/CartPage.tsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OrderSummaryOverlay from "../components/OrderSummaryOverlay";
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

// API URLs
const CART_API_URL = "http://localhost:8000/cart";
const PRODUCT_API_URL = "http://localhost:8000/product";

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch a single product by ID
  const fetchProductById = async (productId: number) => {
    try {
      const response = await axios.get<ProductResponse>(
        `${PRODUCT_API_URL}/${productId}`
      );
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
      farmer: "Local Farmer", // This information might need to come from another API call
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

  const handleQuantityChange = async (
    productId: number,
    newQuantity: number
  ) => {
    if (newQuantity < 0) return;

    try {
      // Update locally first for better UX
      const updatedCartItems = cartItems
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
        .filter((item) => item.quantity > 0);

      setCartItems(updatedCartItems);

      // Prepare data for API update
      const itemsForApi = updatedCartItems.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      }));

      // Get the token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to update your cart");
        await fetchCartItems(); // Revert to server state
        return;
      }

      // Send update to API
      console.log("Updating cart with:", itemsForApi);
      await axios.post(
        CART_API_URL,
        { products: itemsForApi },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Error updating cart:", err);
      setError("Failed to update cart. Please try again.");
      // Revert to previous state if API call fails
      await fetchCartItems();
    }
  };

  const handleRemoveItem = async (productId: number) => {
    try {
      // Update locally first for better UX
      const updatedCartItems = cartItems.filter(
        (item) => item.product.id !== productId
      );
      setCartItems(updatedCartItems);

      // Prepare data for API update
      const itemsForApi = updatedCartItems.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      }));

      // Get the token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to update your cart");
        await fetchCartItems(); // Revert to server state
        return;
      }

      // Send update to API
      console.log("Updating cart after removal:", itemsForApi);
      await axios.post(
        CART_API_URL,
        { products: itemsForApi },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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

  const handlePlaceOrder = () => {
    setShowOrderSummary(true);
    // Prevent body scrolling when overlay is open
    document.body.style.overflow = "hidden";
  };

  const handleCloseOrderSummary = () => {
    setShowOrderSummary(false);
    // Re-enable body scrolling
    document.body.style.overflow = "auto";
  };

  const handleClearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to clear your cart");
        return;
      }

      console.log("Clearing cart...");
      await axios.post(
        `${CART_API_URL}/clear`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
                    <img src={item.product.image} alt={item.product.name} />
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
                          disabled={loading}
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
                          disabled={loading}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveItem(item.product.id)}
                        disabled={loading}
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
                disabled={loading}
              >
                Place Order
              </button>
              <button
                className="clear-cart-btn"
                onClick={handleClearCart}
                disabled={loading}
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

      <OrderSummaryOverlay
        isOpen={showOrderSummary}
        onClose={handleCloseOrderSummary}
        cartItems={cartItems}
        subtotal={calculateSubtotal()}
        deliveryFee={calculateDeliveryFee()}
        total={calculateTotal()}
      />

      <Footer />
    </div>
  );
};

export default CartPage;

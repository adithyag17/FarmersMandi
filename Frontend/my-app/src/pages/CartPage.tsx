// src/pages/CartPage.tsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OrderSummaryOverlay from "../components/OrderSummaryOverlay";
import "../styles/pages/CartPage.scss";

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

const CartPage = () => {
  // Assume these would be loaded from localStorage or a global state management solution
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch cart data from localStorage or a state management solution
    // For now, using mock data
    const mockCartItems: CartItem[] = [
      {
        product: {
          id: 1,
          name: "Fresh Tomatoes",
          price: 40,
          unit: "kg",
          image: "/api/placeholder/200/200",
          farmer: "Green Acres Farm",
          category: "vegetables",
        },
        quantity: 2,
      },
      {
        product: {
          id: 2,
          name: "Organic Apples",
          price: 120,
          unit: "kg",
          image: "/api/placeholder/200/200",
          farmer: "Hillside Orchards",
          category: "fruits",
        },
        quantity: 1,
      },
      {
        product: {
          id: 3,
          name: "Brown Rice",
          price: 70,
          unit: "kg",
          image: "/api/placeholder/200/200",
          farmer: "Valley Grains",
          category: "grains",
        },
        quantity: 3,
      },
    ];

    setCartItems(mockCartItems);
    setLoading(false);
  }, []);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 0) return;

    setCartItems((prevItems) => {
      if (newQuantity === 0) {
        // Remove item if quantity is 0
        return prevItems.filter((item) => item.product.id !== productId);
      } else {
        // Update quantity
        return prevItems.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
    });
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );
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

  return (
    <div className="cart-page">
      <Navbar />

      <div className="container">
        <h1 className="page-title">Your Cart</h1>

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
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveItem(item.product.id)}
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
              <button className="place-order-btn" onClick={handlePlaceOrder}>
                Place Order
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
            <Link to="/" className="button primary">
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

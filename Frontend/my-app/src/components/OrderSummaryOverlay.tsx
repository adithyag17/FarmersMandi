import React, { useState, useEffect } from "react";
import "../styles/components/ProductOverlay.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

interface ProductOverlayProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  token?: string; // Optional auth token for API requests
  cartItems: CartItem[]; // This will still be used as fallback
}

const ProductOverlay: React.FC<ProductOverlayProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  token,
  cartItems,
}) => {
  const [quantity, setQuantity] = useState(0);
  const [, setIsAdded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // Fetch cart data when overlay opens
  useEffect(() => {
    const fetchCartData = async () => {
      if (!isOpen || !product || !token) return;

      setIsLoading(true);

      try {
        const headers: Record<string, string> = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get<CartResponse>(`${API_BASE_URL}/cart`, {
          headers,
        });
        if (response.status === 401) {
          navigate("/login");
        }
        console.log("Cart data fetched:", response.data);

        // Find if current product exists in cart
        const cartProduct = response.data.products.find(
          (item) => item.product_id === product.id
        );

        if (cartProduct) {
          setQuantity(cartProduct.quantity);
          setIsAdded(cartProduct.quantity > 0);
        } else {
          setQuantity(0);
          setIsAdded(false);
        }
      } catch (error) {
        console.error("Failed to fetch cart data:", error);

        // Fall back to cartItems prop if API call fails
        const existingItem = cartItems.find(
          (item) => item.product.id === product.id
        );
        if (existingItem) {
          setQuantity(existingItem.quantity);
          setIsAdded(existingItem.quantity > 0);
        } else {
          setQuantity(0);
          setIsAdded(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartData();
  }, [isOpen, product, token, cartItems]);

  // Update cart on the server
  const updateCart = async () => {
    if (isUpdating || !product) return;

    setIsUpdating(true);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Add Authorization header only if token is provided
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // First, get the current cart state
      const currentCartResponse = await axios.get<CartResponse>(
        `${API_BASE_URL}/cart`,
        { headers }
      );
      if (currentCartResponse.status == 401) {
        navigate("/login");
      }
      // Create a map of existing products for easier manipulation
      const existingProducts = new Map();
      currentCartResponse.data.products.forEach((item) => {
        existingProducts.set(item.product_id, item.quantity);
      });

      // Update the quantity for the current product
      existingProducts.set(product.id, quantity);

      // Remove products with zero quantity
      if (quantity === 0) {
        existingProducts.delete(product.id);
      }

      // Convert back to the format expected by the API
      const updatedCartItems = Array.from(existingProducts.entries()).map(
        ([productId, qty]) => ({
          product_id: productId,
          quantity: qty,
        })
      );

      // Send the complete updated cart to the server
      const response = await axios.post(
        `${API_BASE_URL}/cart`,
        updatedCartItems,
        {
          headers,
        }
      );
      if (response.status === 401) {
        navigate("/login");
      }
      console.log("Cart updated successfully:", updatedCartItems);

      // Update local state after successful server update
      onAddToCart(product, quantity);
      setIsAdded(quantity > 0);
    } catch (error) {
      console.error("Failed to update cart:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Navigate to cart page
  const handleViewCart = () => {
    navigate("/cart");
    onClose(); // Close the overlay when navigating away
  };

  if (!product) return null;

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    if (newQuantity === 0) {
      setIsAdded(false);
    } else {
      setIsAdded(true);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`product-overlay-wrapper ${isOpen ? "open" : ""}`}
      onClick={handleOverlayClick}
    >
      <div className="product-overlay-card">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>

        <div className="product-overlay-content">
          <div className="product-overlay-image">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="product-overlay-details">
            <h2>{product.name}</h2>
            <p className="product-price">
              ₹{product.price}/{product.unit}
            </p>
            <p className="product-farmer">by {product.farmer}</p>

            <div className="product-description">
              <h3>Description</h3>
              <p>
                {product.description ||
                  `Fresh ${product.name.toLowerCase()} sourced directly from local farmers. No chemicals, pesticides, or preservatives used.`}
              </p>
            </div>

            <div className="product-actions">
              {isLoading ? (
                <div className="loading-indicator">Loading cart data...</div>
              ) : (
                <>
                  <div className="quantity-controls">
                    <button
                      className="quantity-button"
                      onClick={() =>
                        handleQuantityChange(Math.max(0, quantity - 1))
                      }
                      disabled={isUpdating}
                    >
                      −
                    </button>
                    <span className="quantity">{quantity}</span>
                    <button
                      className="quantity-button"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={isUpdating}
                    >
                      +
                    </button>

                    {/* Cart icon instead of view cart button */}
                    <div className="cart-icon" onClick={handleViewCart}>
                      <i className="fas fa-shopping-cart"></i>
                    </div>
                  </div>

                  <div className="button-container">
                    <button
                      className="button add-to-cart"
                      onClick={updateCart}
                      disabled={isUpdating || quantity === 0}
                    >
                      {isUpdating
                        ? "Updating..."
                        : quantity === 0
                        ? "Select Quantity"
                        : "Update to Cart"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOverlay;

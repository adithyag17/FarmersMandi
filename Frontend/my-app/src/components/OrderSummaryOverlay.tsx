import React, { useState, useEffect } from "react";
import "../styles/components/ProductOverlay.scss";
import axios from "axios";

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

  // Fetch cart data when overlay opens
  useEffect(() => {
    const fetchCartData = async () => {
      if (!isOpen || !product || !token) return;

      setIsLoading(true);

      try {
        const headers: Record<string, string> = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get<CartResponse>(
          "http://localhost:8000/cart",
          { headers }
        );
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

      // Send the current quantity to the server
      const items = [{ product_id: product.id, quantity }];
      await axios.post("http://localhost:8000/cart", items, { headers });
      console.log("Cart updated successfully:", items);

      // Update local state after successful server update
      onAddToCart(product, quantity);
      setIsAdded(quantity > 0);
    } catch (error) {
      console.error("Failed to update cart:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Remove item from cart

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

// CartContext.tsx
import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// In src/contexts/CartContext.tsx, make sure your Product interface matches the one used in HomePage
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

// Define API response structure for cart items
interface CartProductResponse {
  product_id: number;
  name?: string;
  price?: number;
  unit?: string;
  image?: string;
  farmer?: string;
  category?: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (product: Product, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
}

interface CartContextProviderProps {
  children: React.ReactNode;
  token?: string;
}

// Create context with default values
const CartContext = createContext<CartContextType>({
  cartItems: [],
  isLoading: false,
  error: null,
  fetchCart: async () => {},
  addToCart: async () => {},
  removeFromCart: async () => {},
  clearCart: async () => {},
  updateQuantity: async () => {},
});

// CartProvider component
export const CartProvider: React.FC<CartContextProviderProps> = ({
  children,
  token,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Get auth headers for API requests
  const getHeaders = useCallback(() => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }, [token]);

  // Fetch cart from API
  const fetchCart = useCallback(async () => {
    if (!token) {
      console.log("No token available, skipping cart fetch");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/cart`, {
        headers: getHeaders(),
      });
      if (response.status === 401) {
        navigate("/login");
      }

      // Transform API response to our CartItem format
      const items = response.data.products.map((item: CartProductResponse) => ({
        product: {
          id: item.product_id,
          name: item.name || "Product",
          price: item.price || 0,
          unit: item.unit || "unit",
          image: item.image || "",
          farmer: item.farmer || "Local Farmer",
          category: item.category || "General",
        },
        quantity: item.quantity,
      }));

      setCartItems(items);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setError("Failed to load your cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL, getHeaders, navigate, token]);

  // Add product to cart
  const addToCart = useCallback(
    async (product: Product, quantity: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const items = [{ product_id: product.id, quantity }];
        await axios.post(`${API_BASE_URL}/cart`, items, {
          headers: getHeaders(),
        });

        // Update local state
        const existingItemIndex = cartItems.findIndex(
          (item) => item.product.id === product.id
        );

        if (existingItemIndex !== -1) {
          // Replace existing item with updated quantity
          const updatedItems = [...cartItems];
          updatedItems[existingItemIndex] = { product, quantity };
          setCartItems(updatedItems);
        } else {
          // Add new item to cart
          setCartItems([...cartItems, { product, quantity }]);
        }
      } catch (err) {
        console.error("Failed to add to cart:", err);
        setError("Failed to add item to your cart. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [API_BASE_URL, cartItems, getHeaders]
  );

  // Remove product from cart
  const removeFromCart = useCallback(
    async (productId: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const items = [{ product_id: productId, quantity: 0 }];
        await axios.post(`${API_BASE_URL}/cart`, items, {
          headers: getHeaders(),
        });

        // Update local state
        setCartItems(cartItems.filter((item) => item.product.id !== productId));
      } catch (err) {
        console.error("Failed to remove from cart:", err);
        setError("Failed to remove item from your cart. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [API_BASE_URL, cartItems, getHeaders]
  );

  // Clear entire cart
  const clearCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await axios.post(
        `${API_BASE_URL}/cart/clear`,
        {},
        {
          headers: getHeaders(),
        }
      );

      // Update local state
      setCartItems([]);
    } catch (err) {
      console.error("Failed to clear cart:", err);
      setError("Failed to clear your cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL, getHeaders]);

  // Update item quantity
  const updateQuantity = useCallback(
    async (productId: number, quantity: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const items = [{ product_id: productId, quantity }];
        await axios.post(`${API_BASE_URL}/cart`, items, {
          headers: getHeaders(),
        });

        // Update local state
        if (quantity > 0) {
          setCartItems(
            cartItems.map((item) =>
              item.product.id === productId ? { ...item, quantity } : item
            )
          );
        } else {
          // Remove item if quantity is 0
          setCartItems(
            cartItems.filter((item) => item.product.id !== productId)
          );
        }
      } catch (err) {
        console.error("Failed to update quantity:", err);
        setError("Failed to update your cart. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [API_BASE_URL, cartItems, getHeaders]
  );

  // Fetch cart on initial load and when token changes
  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token, fetchCart]);

  const value = {
    cartItems,
    isLoading,
    error,
    fetchCart,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Function export moved to a separate file to fix Fast Refresh warning
// Export the context as default
const contextObj = { CartContext, CartProvider };
export default contextObj;

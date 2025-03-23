// src/pages/CategoryPage.tsx

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductOverlay from "../components/OrderSummaryOverlay";
import "../styles/pages/CategoryPage.scss";

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

interface ApiProduct {
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

interface CartItem {
  product: Product;
  quantity: number;
}

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  // Product overlay states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductOverlay, setShowProductOverlay] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_BASE_URL}/product/category/${category}`
        );
        if (response.status == 401) {
          navigate("/login");
        }
        if (!response.ok) {
          throw new Error(`Error fetching products: ${response.status}`);
        }

        const apiProducts: ApiProduct[] = await response.json();

        // Map API products to the format expected by the component
        const mappedProducts: Product[] = apiProducts.map((apiProduct) => ({
          id: apiProduct.product_id,
          name: apiProduct.product_name,
          price: apiProduct.product_price / 100, // Converting from paise to rupees if needed
          unit: `${apiProduct.product_weight}g`, // Using weight as unit
          image:
            apiProduct.images?.length > 0
              ? `/images/${apiProduct.images[0]}`
              : "/api/placeholder/200/200",
          farmer: "Local Farmer", // This info is not in the API response, using placeholder
          category: apiProduct.product_category.toLowerCase(),
          description: apiProduct.product_description,
        }));

        setProducts(mappedProducts);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchProducts();
    }
  }, [category]);

  // Handlers for product overlay
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowProductOverlay(true);
    // Prevent body scrolling when overlay is open
    document.body.style.overflow = "hidden";
  };

  const handleCloseOverlay = () => {
    setShowProductOverlay(false);
    // Re-enable body scrolling
    document.body.style.overflow = "auto";
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    setCartItems((prevItems) => {
      // Check if product already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id
      );
      console.log(cartItems);
      if (existingItemIndex !== -1) {
        // Update existing item
        const updatedItems = [...prevItems];
        if (quantity === 0) {
          // Remove item if quantity is 0
          updatedItems.splice(existingItemIndex, 1);
        } else {
          // Update quantity
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity,
          };
        }
        return updatedItems;
      } else if (quantity > 0) {
        // Add new item
        return [...prevItems, { product, quantity }];
      }

      return prevItems;
    });
  };

  // Format category name for display
  const formatCategoryName = (categoryName: string | undefined) => {
    if (!categoryName) return "";
    return categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  };

  // Product card component
  const ProductCard = ({ product }: { product: Product }) => (
    <div className="product-card" onClick={() => handleProductClick(product)}>
      <div className="product-image">
        <img src={"https://iili.io/3IKKRjf.jpg"} alt={product.name} />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">
          ₹{product.price}/{product.unit}
        </p>
      </div>
    </div>
  );

  return (
    <div className="category-page">
      <Navbar />

      <div className="container">
        <section className="category-header">
          <h1>{formatCategoryName(category)}</h1>
          <p>All available {category} from our local farmers</p>
        </section>

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : products.length > 0 ? (
          <section className="products-grid">
            {products.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </section>
        ) : (
          <div className="no-products">
            <p>No products found in this category.</p>
          </div>
        )}
      </div>

      {/* Product Overlay */}
      <ProductOverlay
        product={selectedProduct}
        isOpen={showProductOverlay}
        onClose={handleCloseOverlay}
        onAddToCart={handleAddToCart}
        cartItems={cartItems}
      />

      <Footer />
    </div>
  );
};

export default CategoryPage;

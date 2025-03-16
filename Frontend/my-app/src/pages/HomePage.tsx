// src/pages/HomePage.tsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductOverlay from "../components/OrderSummaryOverlay";
import "../styles/pages/HomePage.scss";

// Backend Product interface
interface BackendProduct {
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

// Frontend Product interface
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

// Function to map backend product to frontend product format
const mapBackendToFrontend = (backendProduct: BackendProduct): Product => {
  return {
    id: backendProduct.product_id,
    name: backendProduct.product_name,
    price: backendProduct.product_price / 100, // Convert cents to dollars if needed
    unit: backendProduct.product_weight
      ? `${backendProduct.product_weight}g`
      : "unit",
    image: backendProduct.images?.[0] || "/api/placeholder/200/200",
    farmer: "Local Farmer", // Default value
    category: backendProduct.product_category,
    description: backendProduct.product_description,
  };
};

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductOverlay, setShowProductOverlay] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // State for all products (fetched once)
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<
    Record<string, Product[]>
  >({});
  const [categories, setCategories] = useState<string[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  // Maximum number of products to show per category
  const MAX_PRODUCTS_PER_CATEGORY = 3;

  // Detect screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch all products once
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        // Make a single API call to get all products
        const response = await fetch("http://localhost:8000/product");

        if (!response.ok) {
          throw new Error(
            `Failed to fetch products: ${response.status} ${response.statusText}`
          );
        }

        const backendProducts = (await response.json()) as BackendProduct[];
        console.log("Fetched products:", backendProducts); // Debug log

        // Convert all backend products to frontend format
        const frontendProducts = backendProducts.map(mapBackendToFrontend);
        setAllProducts(frontendProducts);

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(frontendProducts.map((p) => p.category)),
        ];
        setCategories(uniqueCategories);

        // Group products by category
        const productsByCat: Record<string, Product[]> = {};
        for (const category of uniqueCategories) {
          productsByCat[category] = frontendProducts.filter(
            (p) => p.category === category
          );
        }
        setProductsByCategory(productsByCat);

        // Set featured products (taking first 4 products)
        setFeaturedProducts(frontendProducts.slice(0, 4));

        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setLoading(false);
      }
    };

    fetchProductData();
  }, []);

  // Client-side search implementation
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      setShowSearchResults(false);
      return;
    }

    // Perform search on the client-side using allProducts
    const query = searchQuery.toLowerCase().trim();
    const results = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );

    setSearchResults(results);
    setShowSearchResults(true);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchResults(false);
  };

  // Get proper number of featured products based on screen size
  const getFeaturedProducts = () => {
    return featuredProducts.slice(0, isMobile ? 2 : 4);
  };

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

  // Product card component
  const ProductCard = ({
    product,
    featured = false,
  }: {
    product: Product;
    featured?: boolean;
  }) => (
    <div
      className={`product-card ${featured ? "featured" : ""}`}
      onClick={() => handleProductClick(product)}
    >
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">
          ₹{product.price}/{product.unit}
        </p>
      </div>
    </div>
  );

  if (loading && !showSearchResults) {
    return (
      <div className="home-page">
        <Navbar />
        <div className="container">
          <div className="loading">Loading products...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error && !showSearchResults) {
    return (
      <div className="home-page">
        <Navbar />
        <div className="container">
          <div className="error">Error: {error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="home-page">
      <Navbar />

      <div className="container">
        <section className="search-section">
          <div className="search-container">
            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-input-container">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-button">
                  Search
                </button>
              </div>
            </form>
          </div>
        </section>

        {showSearchResults ? (
          <section className="search-results">
            <div className="results-header">
              <h2>Search Results</h2>
              <button className="clear-button" onClick={clearSearch}>
                Clear Search
              </button>
            </div>
            {searchResults.length > 0 ? (
              <div className="results-container">
                {searchResults.map((product) => (
                  <ProductCard product={product} key={product.id} />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <p>No products found matching "{searchQuery}"</p>
              </div>
            )}
          </section>
        ) : (
          <>
            <section className="featured-products">
              <h2 className="section-title">Featured Products</h2>
              <div className="carousel-container">
                <div className="carousel-track">
                  {getFeaturedProducts().map((product) => (
                    <ProductCard
                      product={product}
                      featured={true}
                      key={product.id}
                    />
                  ))}
                </div>
              </div>
            </section>

            {categories.map((category) => (
              <section className="product-category" key={category}>
                <h2 className="section-title">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h2>
                <div className="carousel-container">
                  <div className="carousel-track">
                    {productsByCategory[category]
                      ?.slice(0, MAX_PRODUCTS_PER_CATEGORY)
                      .map((product) => (
                        <ProductCard product={product} key={product.id} />
                      ))}
                  </div>
                </div>
                <div className="view-all">
                  <Link
                    to={`/category/${category}`}
                    className="button secondary"
                  >
                    View All{" "}
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Link>
                </div>
              </section>
            ))}
          </>
        )}
      </div>

      {/* Product Overlay */}
      <ProductOverlay
        product={selectedProduct}
        isOpen={showProductOverlay}
        onClose={handleCloseOverlay}
        onAddToCart={handleAddToCart}
      />

      <Footer />
    </div>
  );
};

export default HomePage;

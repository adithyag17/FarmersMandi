// src/pages/HomePage.tsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductOverlay from "../components/OrderSummaryOverlay";
import "../styles/pages/HomePage.scss";

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

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // New state for product overlay
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductOverlay, setShowProductOverlay] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Detect screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mock product data for carousel and search
  const products: Product[] = [
    {
      id: 1,
      name: "Fresh Tomatoes",
      price: 40,
      unit: "kg",
      image: "/api/placeholder/200/200",
      farmer: "Green Acres Farm",
      category: "vegetables",
      description:
        "Juicy, ripe tomatoes grown naturally without chemical fertilizers. Perfect for salads and cooking.",
    },
    {
      id: 2,
      name: "Organic Apples",
      price: 120,
      unit: "kg",
      image: "/api/placeholder/200/200",
      farmer: "Hillside Orchards",
      category: "fruits",
      description:
        "Sweet and crunchy apples, hand-picked from organic orchards. Rich in fiber and antioxidants.",
    },
    {
      id: 3,
      name: "Brown Rice",
      price: 70,
      unit: "kg",
      image: "/api/placeholder/200/200",
      farmer: "Valley Grains",
      category: "grains",
      description:
        "Nutritious whole grain brown rice, naturally grown and sustainably harvested.",
    },
    {
      id: 4,
      name: "Fresh Spinach",
      price: 30,
      unit: "bunch",
      image: "/api/placeholder/200/200",
      farmer: "Riverside Farms",
      category: "vegetables",
      description:
        "Leafy green spinach packed with iron and vitamins. Freshly harvested each morning.",
    },
    {
      id: 4,
      name: "Fresh Spinach",
      price: 30,
      unit: "bunch",
      image: "/api/placeholder/200/200",
      farmer: "Riverside Farms",
      category: "vegetables",
      description:
        "Leafy green spinach packed with iron and vitamins. Freshly harvested each morning.",
    },
    {
      id: 5,
      name: "Organic Mangoes",
      price: 150,
      unit: "kg",
      image: "/api/placeholder/200/200",
      farmer: "Sunshine Fruits",
      category: "fruits",
    },
    {
      id: 6,
      name: "Millet Flour",
      price: 60,
      unit: "kg",
      image: "/api/placeholder/200/200",
      farmer: "Golden Harvest",
      category: "grains",
    },
    {
      id: 7,
      name: "Fresh Potatoes",
      price: 35,
      unit: "kg",
      image: "/api/placeholder/200/200",
      farmer: "Hilltop Farms",
      category: "vegetables",
    },
    {
      id: 8,
      name: "Organic Bananas",
      price: 80,
      unit: "dozen",
      image: "/api/placeholder/200/200",
      farmer: "Tropical Farms",
      category: "fruits",
    },
  ];

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      setShowSearchResults(false);
      return;
    }

    // Filter products based on search query
    const results = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.farmer.toLowerCase().includes(searchQuery.toLowerCase())
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
    return products.slice(0, isMobile ? 3 : 4);
  };

  // New handlers for product overlay
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

  // Product card component with click handler
  const ProductCard = ({
    product,
    featured = false,
  }: {
    product: Product;
    featured?: boolean;
  }) => (
    <div
      className={`product-card ${featured ? "featured" : ""}`}
      key={product.id}
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
        <p className="product-farmer">Farmer: {product.farmer}</p>
        {/* Add to cart button removed from card since clicking the card now opens overlay */}
      </div>
    </div>
  );

  return (
    <div className="home-page">
      <Navbar />

      <div className="container">
        <section className="search-section">
          <div className="search-container">
            <form className="search-form" onSubmit={handleSearch}>
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

            {Object.entries(productsByCategory).map(
              ([category, categoryProducts]) => (
                <section className="product-category" key={category}>
                  <h2 className="section-title">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </h2>
                  <div className="carousel-container">
                    <div className="carousel-track">
                      {categoryProducts.map((product) => (
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
              )
            )}
          </>
        )}

        <section className="about-section">
          <div className="about-content">
            <h2 className="section-title">Buy Direct from Farmers</h2>
            <p>
              Farmers Mandi connects you directly with local farmers, ensuring
              you get the freshest produce at fair prices. Support local
              agriculture while enjoying high-quality, fresh food for your
              family.
            </p>
            <Link to="/about-us" className="button secondary">
              Learn More About Us
            </Link>
          </div>
        </section>
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

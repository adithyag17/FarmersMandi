// src/pages/CategoryPage.tsx

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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

interface CartItem {
  product: Product;
  quantity: number;
}

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Product overlay states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductOverlay, setShowProductOverlay] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // This would be replaced with an API call to fetch products from a database
    // For now, using the same mock data from HomePage
    const mockProducts: Product[] = [
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

    // Filter products by category
    if (category) {
      const filteredProducts = mockProducts.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
      setProducts(filteredProducts);
    }

    setLoading(false);
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
    <div
      className="product-card"
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
      />

      <Footer />
    </div>
  );
};

export default CategoryPage;

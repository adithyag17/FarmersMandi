import React, { useState, useEffect } from "react";
import "../styles/components/ProductOverlay.scss";

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

interface ProductOverlayProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductOverlay: React.FC<ProductOverlayProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  // Reset states when product changes
  useEffect(() => {
    setQuantity(0);
    setIsAdded(false);
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
    setQuantity(1);
    setIsAdded(true);
    onAddToCart(product, 1);
  };

  const handleIncreaseQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onAddToCart(product, newQuantity);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onAddToCart(product, newQuantity);
      if (newQuantity === 0) {
        setIsAdded(false);
      }
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
              {!isAdded ? (
                <button
                  className="button add-to-cart"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              ) : (
                <div className="quantity-controls">
                  <button
                    className="quantity-button"
                    onClick={handleDecreaseQuantity}
                  >
                    −
                  </button>
                  <span className="quantity">{quantity}</span>
                  <button
                    className="quantity-button"
                    onClick={handleIncreaseQuantity}
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOverlay;

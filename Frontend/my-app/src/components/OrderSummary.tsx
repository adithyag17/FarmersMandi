// src/components/OrderSummaryOverlay.tsx

import { useState } from "react";
import "../styles/components/OrderSummaryOverlay.scss";

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

interface OrderSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

const OrderSummaryOverlay = ({
  isOpen,
  onClose,
  cartItems,
  subtotal,
  deliveryFee,
  total,
}: OrderSummaryProps) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    paymentMethod: "cash",
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep === 1) {
      // Go to payment step
      setCurrentStep(2);
    } else {
      // Here you would typically process the order
      // For this example, just simulate a successful order
      setOrderPlaced(true);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  // Validate if all required fields are filled
  const isFormValid = () => {
    if (currentStep === 1) {
      return (
        formData.fullName &&
        formData.email &&
        formData.phone &&
        formData.address &&
        formData.city &&
        formData.state &&
        formData.zipCode
      );
    }
    return formData.paymentMethod;
  };

  if (!isOpen) return null;

  return (
    <div className="overlay-container">
      <div className="overlay-backdrop" onClick={onClose}></div>
      <div className="order-summary-overlay">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>

        {orderPlaced ? (
          <div className="order-confirmation">
            <div className="success-icon">✓</div>
            <h2>Order Placed Successfully!</h2>
            <p>
              Thank you for your order. Your order number is #
              {Math.floor(Math.random() * 100000)}.
            </p>
            <p>You will receive a confirmation email shortly.</p>
            <button className="primary-button" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="overlay-title">
              {currentStep === 1 ? "Delivery Details" : "Payment Details"}
            </h2>

            {/* Step indicator */}
            <div className="step-indicator">
              <div
                className={`step ${currentStep === 1 ? "active" : "completed"}`}
              >
                <div className="step-number">1</div>
                <div className="step-label">Delivery</div>
              </div>
              <div className="step-line"></div>
              <div className={`step ${currentStep === 2 ? "active" : ""}`}>
                <div className="step-number">2</div>
                <div className="step-label">Payment</div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {currentStep === 1 ? (
                <div className="delivery-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="fullName">Full Name *</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">Address *</label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">City *</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="state">State *</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="zipCode">Zip Code *</label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="payment-form">
                  <div className="payment-methods">
                    <div className="payment-option">
                      <input
                        type="radio"
                        id="cash"
                        name="paymentMethod"
                        value="cash"
                        checked={formData.paymentMethod === "cash"}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="cash">Cash on Delivery</label>
                    </div>
                    <div className="payment-option">
                      <input
                        type="radio"
                        id="upi"
                        name="paymentMethod"
                        value="upi"
                        checked={formData.paymentMethod === "upi"}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="upi">UPI</label>
                    </div>
                    <div className="payment-option">
                      <input
                        type="radio"
                        id="card"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === "card"}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="card">Credit/Debit Card</label>
                    </div>
                  </div>
                </div>
              )}

              <div className="order-details">
                <h3>Order Summary</h3>
                <div className="order-items">
                  {cartItems.map((item) => (
                    <div className="order-item" key={item.product.id}>
                      <span>
                        {item.product.name} × {item.quantity}
                      </span>
                      <span>₹{item.product.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="order-totals">
                  <div className="total-row">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="total-row">
                    <span>Delivery Fee</span>
                    <span>
                      {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <div className="total-row final">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
              </div>

              <div className="form-buttons">
                {currentStep === 2 && (
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={handlePrevStep}
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  className="primary-button"
                  disabled={!isFormValid()}
                >
                  {currentStep === 1 ? "Continue to Payment" : "Place Order"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderSummaryOverlay;

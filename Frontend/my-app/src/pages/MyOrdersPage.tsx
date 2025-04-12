import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/pages/MyOrdersPage.scss";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";

// Updated interfaces to match backend data structure
interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

interface PaymentDetails {
  payment_method?: string;
  [key: string]: unknown;
}

interface Order {
  order_id: number;
  user_id: number;
  products: OrderItem[];
  total_order_price: number;
  order_status: number;
  delivery_address: string;
  payment_details: PaymentDetails;
  created_at: string;
  updated_at: string;
}

const MyOrdersPage = () => {
  const [currentOrders, setCurrentOrders] = useState<Order[]>([]);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get auth token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch(`${API_BASE_URL}/order`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 401) {
          navigate("/login");
        }
        if (!response.ok) {
          throw new Error(`Error fetching orders: ${response.status}`);
        }

        const orders: Order[] = await response.json();

        // Filter orders based on status
        // Backend status codes:
        // 0 = Failed, 1 = Successful, 2 = In Progress
        const current = orders.filter((order) => order.order_status === 2); // In Progress
        const history = orders.filter((order) => order.order_status === 1); // Successful

        setCurrentOrders(current);
        setOrderHistory(history);

        // Show confetti if there are current orders
        if (current.length > 0) {
          setShowConfetti(true);

          // Hide confetti after 5 seconds
          setTimeout(() => {
            setShowConfetti(false);
          }, 5000);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [API_BASE_URL, navigate]);

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Get status text based on status code from backend
  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "Failed";
      case 1:
        return "Completed";
      case 2:
        return "Processing";
      default:
        return "Unknown";
    }
  };

  // Get payment method from payment details
  const getPaymentMethod = (paymentDetails: PaymentDetails) => {
    if (!paymentDetails || Object.keys(paymentDetails).length === 0) {
      return "Pending";
    }
    return paymentDetails.payment_method || "Online";
  };

  // Component for rendering a single order
  const OrderCard = ({ order }: { order: Order }) => (
    <div className="order-card">
      <div className="order-header">
        <div className="order-info">
          <h3>Order #{order.order_id}</h3>
          <p className="order-date">Placed on {formatDate(order.created_at)}</p>
        </div>
        <div className="order-status">
          <span className={`status-badge status-${order.order_status}`}>
            {getStatusText(order.order_status)}
          </span>
        </div>
      </div>

      <div className="order-items">
        {order.products.map((item, index) => (
          <div className="order-item" key={index}>
            <div className="item-details">
              <p className="item-name">
                {item.product_name} (ID: {item.product_id})
              </p>
              <p className="item-quantity">Qty: {item.quantity}</p>
            </div>
            <p className="item-price">₹{item.price}</p>
          </div>
        ))}
      </div>

      <div className="order-footer">
        <div className="delivery-address">
          <h4>Delivery Address</h4>
          <p>{order.delivery_address}</p>
        </div>
        <div className="order-summary">
          <div className="summary-row">
            <span>Payment Method</span>
            <span>{getPaymentMethod(order.payment_details)}</span>
          </div>
          <div className="summary-row total">
            <span>Total Amount</span>
            <span>₹{order.total_order_price}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="my-orders-page">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

      <Navbar />

      <div className="container">
        <h1 className="page-title">My Orders</h1>

        {loading ? (
          <div className="loading">Loading your orders...</div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <section className="orders-section current-orders">
              <h2>Current Orders</h2>
              {currentOrders.length > 0 ? (
                <div className="orders-grid">
                  {currentOrders.map((order) => (
                    <OrderCard order={order} key={order.order_id} />
                  ))}
                </div>
              ) : (
                <div className="no-orders">
                  <p>You don't have any current orders.</p>
                </div>
              )}
            </section>

            <section className="orders-section order-history">
              <h2>Order History</h2>
              {orderHistory.length > 0 ? (
                <div className="orders-grid">
                  {orderHistory.map((order) => (
                    <OrderCard order={order} key={order.order_id} />
                  ))}
                </div>
              ) : (
                <div className="no-orders">
                  <p>You don't have any completed orders yet.</p>
                </div>
              )}
            </section>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyOrdersPage;

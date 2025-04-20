// src/pages/AdminOrdersPage.tsx

import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/pages/AdminOrdersPage.scss";
import { useNavigate } from "react-router-dom";

// Interfaces matching the backend data structure
interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  order_id: number;
  user_id: number;
  products: OrderItem[];
  total_order_price: number;
  order_status: number;
  delivery_address: string;
  payment_details: string;
  created_at: string;
  updated_at: string;
}

// Interface for payment details to avoid using 'any'
interface PaymentDetails {
  payment_method?: string;
  [key: string]: unknown;
}

const AdminOrdersPage = () => {
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [deliveredOrders, setDeliveredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [paymentDetails, setPaymentDetails] = useState<{
    [key: number]: string;
  }>({});
  const [updateLoading, setUpdateLoading] = useState<{
    [key: number]: boolean;
  }>({});
  const [updateSuccess, setUpdateSuccess] = useState<{
    [key: number]: boolean;
  }>({});

  // Function to fetch orders from the backend - using useCallback to memoize
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get auth token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${API_BASE_URL}/order/all`, {
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
      // 2 = In Progress (pending delivery), 1 = Successfully Delivered
      const pending = orders.filter((order) => order.order_status === 2);
      const delivered = orders.filter((order) => order.order_status === 1);

      setPendingOrders(pending);
      setDeliveredOrders(delivered);

      // Initialize payment details for all pending orders
      const initialPaymentDetails: { [key: number]: string } = {};
      pending.forEach((order) => {
        initialPaymentDetails[order.order_id] = "";
      });
      setPaymentDetails(initialPaymentDetails);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, navigate]); // Only depend on stable values

  // Fetch all orders on component mount
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]); // Now safe because fetchOrders is memoized

  const updateOrderStatus = async (orderId: number) => {
    try {
      setUpdateLoading((prev) => ({ ...prev, [orderId]: true }));

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      // Corrected endpoint URL format to match backend implementation
      const response = await fetch(
        `${API_BASE_URL}/admin/AuthoriseDelivery/${orderId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            payment_details: paymentDetails[orderId],
          }),
        }
      );
      if (response.status === 401) {
        navigate("/login");
      }
      if (!response.ok) {
        throw new Error(`Error updating order: ${response.status}`);
      }

      const updatedOrder = await response.json();

      // Update the local state to reflect the change
      setPendingOrders((prev) =>
        prev.filter((order) => order.order_id !== orderId)
      );

      // Since your backend implementation in admin_controller.py returns a different
      // structure than what's expected here, check if we have a full order object
      if (updatedOrder.order_id) {
        setDeliveredOrders((prev) => [...prev, updatedOrder]);
      } else {
        // If we only got a success message, fetch orders again to refresh the data
        fetchOrders();
      }

      setUpdateSuccess((prev) => ({ ...prev, [orderId]: true }));
      setTimeout(() => {
        setUpdateSuccess((prev) => ({ ...prev, [orderId]: false }));
      }, 3000);
    } catch (err) {
      console.error("Failed to update order:", err);
      setError(`Failed to update order #${orderId}. Please try again.`);
    } finally {
      setUpdateLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Get status text based on status code
  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "Failed";
      case 1:
        return "Delivered";
      case 2:
        return "Pending Delivery";
      case 5:
        return "Delivered"; // Adding the backend's status code for delivered
      default:
        return "Unknown";
    }
  };

  // Get payment method from payment details
  const getPaymentMethod = (paymentDetails: string | object) => {
    if (!paymentDetails) {
      return "Pending";
    }

    // Check if paymentDetails is an empty object
    if (
      typeof paymentDetails === "object" &&
      Object.keys(paymentDetails).length === 0
    ) {
      return "Pending";
    }

    if (typeof paymentDetails === "string") {
      try {
        const details = JSON.parse(paymentDetails);
        return details.payment_method || "Online";
      } catch {
        return paymentDetails || "Online";
      }
    }

    // If it's an object with a payment_method property
    if (
      typeof paymentDetails === "object" &&
      "payment_method" in paymentDetails
    ) {
      return (paymentDetails as PaymentDetails).payment_method || "Online";
    }

    return "Online"; // Default case
  };

  // Component for rendering a pending order card with update functionality
  const PendingOrderCard = ({ order }: { order: Order }) => (
    <div className="order-card">
      <div className="order-header">
        <div className="order-info">
          <h3>Order #{order.order_id}</h3>
          <p className="order-date">Placed on {formatDate(order.created_at)}</p>
          <p className="customer-info">Customer ID: {order.user_id}</p>
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
              <p className="item-name">Product ID: {item.product_id}</p>
              <p className="item-name">Product Name: {item.product_name}</p>
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

      <div className="admin-actions">
        <div className="payment-details-input">
          <label htmlFor={`payment-${order.order_id}`}>Payment Details:</label>
          <input
            id={`payment-${order.order_id}`}
            type="text"
            value={paymentDetails[order.order_id] || ""}
            onChange={(e) =>
              setPaymentDetails((prev) => ({
                ...prev,
                [order.order_id]: e.target.value,
              }))
            }
            placeholder="Enter payment details"
          />
        </div>
        <button
          className="mark-delivered-btn"
          onClick={() => updateOrderStatus(order.order_id)}
          disabled={updateLoading[order.order_id]}
        >
          {updateLoading[order.order_id] ? "Updating..." : "Mark as Delivered"}
        </button>
        {updateSuccess[order.order_id] && (
          <div className="update-success">Order successfully updated!</div>
        )}
      </div>
    </div>
  );

  // Component for rendering a delivered order card (read-only)
  const DeliveredOrderCard = ({ order }: { order: Order }) => (
    <div className="order-card delivered">
      <div className="order-header">
        <div className="order-info">
          <h3>Order #{order.order_id}</h3>
          <p className="order-date">Placed on {formatDate(order.created_at)}</p>
          <p className="customer-info">Customer ID: {order.user_id}</p>
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
              <p className="item-name">Product ID: {item.product_id}</p>
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
          {order.payment_details &&
            typeof order.payment_details === "string" && (
              <div className="summary-row">
                <span>Payment Details</span>
                <span>{order.payment_details}</span>
              </div>
            )}
          <div className="summary-row total">
            <span>Total Amount</span>
            <span>₹{order.total_order_price}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-orders-page">
      <Navbar />

      <div className="container">
        <h1 className="page-title">Admin Order Management</h1>

        {loading ? (
          <div className="loading">Loading orders...</div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchOrders}>
              Retry
            </button>
          </div>
        ) : (
          <>
            <section className="orders-section pending-orders">
              <h2>Yet to be Delivered Orders</h2>
              {pendingOrders.length > 0 ? (
                <div className="orders-grid">
                  {pendingOrders.map((order) => (
                    <PendingOrderCard order={order} key={order.order_id} />
                  ))}
                </div>
              ) : (
                <div className="no-orders">
                  <p>There are no pending orders to display.</p>
                </div>
              )}
            </section>

            <section className="orders-section delivered-orders">
              <h2>Successfully Delivered Orders</h2>
              {deliveredOrders.length > 0 ? (
                <div className="orders-grid">
                  {deliveredOrders.map((order) => (
                    <DeliveredOrderCard order={order} key={order.order_id} />
                  ))}
                </div>
              ) : (
                <div className="no-orders">
                  <p>There are no delivered orders to display.</p>
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

export default AdminOrdersPage;

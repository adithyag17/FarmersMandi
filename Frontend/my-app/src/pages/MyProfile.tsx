import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Edit2,
  Save,
  X,
  Package,
  Clock,
  User,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/pages/MyProfile.scss";

interface UserDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface OrderItem {
  id: string;
  product: string;
  price: number;
  quantity: number;
  status: string;
  date: string;
}

const MyProfile: React.FC = () => {
  // State for dropdown sections
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(true);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [activeOrderTab, setActiveOrderTab] = useState<"current" | "history">(
    "current"
  );

  // State for user details
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 123-456-7890",
    address: "123 Main St, New York, NY 10001",
  });

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState<UserDetails>(userDetails);

  // State for orders
  const [currentOrders, setCurrentOrders] = useState<OrderItem[]>([]);
  const [orderHistory, setOrderHistory] = useState<OrderItem[]>([]);

  // Simulate fetching orders from an API
  useEffect(() => {
    // Simulated API call
    const fetchOrders = () => {
      // Mock data
      const mockCurrentOrders: OrderItem[] = [
        {
          id: "ORD-001",
          product: "Bluetooth Headphones",
          price: 79.99,
          quantity: 1,
          status: "Shipped",
          date: "2025-03-10",
        },
        {
          id: "ORD-002",
          product: "Wireless Mouse",
          price: 29.99,
          quantity: 1,
          status: "Processing",
          date: "2025-03-12",
        },
      ];

      const mockOrderHistory: OrderItem[] = [
        {
          id: "ORD-000",
          product: "Mechanical Keyboard",
          price: 129.99,
          quantity: 1,
          status: "Delivered",
          date: "2025-02-15",
        },
        {
          id: "ORD-00A",
          product: "USB-C Cable",
          price: 15.99,
          quantity: 2,
          status: "Delivered",
          date: "2025-01-20",
        },
        {
          id: "ORD-00B",
          product: "Laptop Stand",
          price: 45.99,
          quantity: 1,
          status: "Delivered",
          date: "2024-12-05",
        },
      ];

      setCurrentOrders(mockCurrentOrders);
      setOrderHistory(mockOrderHistory);
    };

    fetchOrders();
  }, []);

  // Toggle dropdown sections
  const toggleUserDetails = () => setIsUserDetailsOpen(!isUserDetailsOpen);
  const toggleOrders = () => setIsOrdersOpen(!isOrdersOpen);

  // Handle editing user details
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset to original values
      setEditedDetails(userDetails);
    } else {
      // Start editing
      setEditedDetails({ ...userDetails });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveDetails = () => {
    // Save edited details
    setUserDetails({ ...editedDetails });
    setIsEditing(false);
    // Here you would typically make an API call to update the user details
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Render the order tables
  const renderOrderTable = (orders: OrderItem[]) => {
    if (orders.length === 0) {
      return <p className="no-orders">No orders found.</p>;
    }

    return (
      <div className="order-table-container">
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.product}</td>
                <td>${order.price.toFixed(2)}</td>
                <td>{order.quantity}</td>
                <td>
                  <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="profile-page">
      <Navbar />
      <div className="container">
        <div className="profile-container">
          <h1 className="profile-title">My Profile</h1>

          {/* User Details Section */}
          <div className="profile-section">
            <div className="section-header" onClick={toggleUserDetails}>
              <div className="header-content">
                <User className="section-icon" />
                <h2>User Details</h2>
              </div>
              {isUserDetailsOpen ? <ChevronUp /> : <ChevronDown />}
            </div>

            {isUserDetailsOpen && (
              <div className="section-content user-details-content">
                <div className="action-buttons">
                  {isEditing ? (
                    <>
                      <button
                        className="btn save-btn"
                        onClick={handleSaveDetails}
                      >
                        <Save size={16} />
                        Save
                      </button>
                      <button
                        className="btn cancel-btn secondary"
                        onClick={handleEditToggle}
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn edit-btn secondary"
                      onClick={handleEditToggle}
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                  )}
                </div>

                <div className="user-details-grid">
                  <div className="form-group">
                    <label>Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={editedDetails.name}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p>{userDetails.name}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editedDetails.email}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p>{userDetails.email}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={editedDetails.phone}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p>{userDetails.phone}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Address</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={editedDetails.address}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p>{userDetails.address}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Orders Section */}
          <div className="profile-section">
            <div className="section-header" onClick={toggleOrders}>
              <div className="header-content">
                <Package className="section-icon" />
                <h2>My Orders</h2>
              </div>
              {isOrdersOpen ? <ChevronUp /> : <ChevronDown />}
            </div>

            {isOrdersOpen && (
              <div className="section-content orders-content">
                <div className="tabs">
                  <button
                    className={`tab ${
                      activeOrderTab === "current" ? "active" : ""
                    }`}
                    onClick={() => setActiveOrderTab("current")}
                  >
                    <Package size={16} />
                    Current Orders
                  </button>
                  <button
                    className={`tab ${
                      activeOrderTab === "history" ? "active" : ""
                    }`}
                    onClick={() => setActiveOrderTab("history")}
                  >
                    <Clock size={16} />
                    Order History
                  </button>
                </div>

                <div className="tab-content">
                  {activeOrderTab === "current"
                    ? renderOrderTable(currentOrders)
                    : renderOrderTable(orderHistory)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyProfile;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Edit2,
  Save,
  X,
  Package,
  User,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/pages/MyProfile.scss";

interface UserDetails {
  name: string;
  email: string;
  contact_number: string; // Changed from phone to match backend
  location: string; // Changed from address to match backend
  id?: number;
  role?: number;
  created_at?: string;
  updated_at?: string;
}

const MyProfile: React.FC = () => {
  const navigate = useNavigate();

  // State for dropdown sections
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(true);

  // State for user details
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: "",
    email: "",
    contact_number: "",
    location: "",
  });

  // State for loading and error handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState<UserDetails>(userDetails);

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get auth token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch("http://localhost:8000/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status == 401) {
        navigate("/login");
      }

      if (!response.ok) {
        throw new Error(`Error fetching profile: ${response.status}`);
      }

      const userData = await response.json();

      setUserDetails({
        name: userData.name,
        email: userData.email,
        contact_number: userData.contact_number,
        location: userData.location,
        id: userData.id,
        role: userData.role,
        created_at: userData.created_at,
        updated_at: userData.updated_at,
      });

      // Also update edited details to match
      setEditedDetails({
        name: userData.name,
        email: userData.email,
        contact_number: userData.contact_number,
        location: userData.location,
        id: userData.id,
        role: userData.role,
        created_at: userData.created_at,
        updated_at: userData.updated_at,
      });
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      setError("Failed to load user profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle dropdown sections
  const toggleUserDetails = () => setIsUserDetailsOpen(!isUserDetailsOpen);

  // Navigate to orders page
  const goToOrders = () => {
    navigate("/myorders");
  };

  // Handle editing user details
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset to original values
      setEditedDetails({ ...userDetails });
    } else {
      // Start editing
      setEditedDetails({ ...userDetails });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch("http://localhost:8000/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editedDetails.name,
          location: editedDetails.location,
          contact_number: editedDetails.contact_number,
          email: editedDetails.email,
        }),
      });
      if (response.status == 401) {
        navigate("/login");
      }
      if (!response.ok) {
        throw new Error(`Error updating profile: ${response.status}`);
      }

      const updatedUser = await response.json();
      setUserDetails(updatedUser);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update user profile:", err);
      setError("Failed to update profile. Please try again later.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="profile-page">
      <Navbar />
      <div className="container">
        <div className="profile-container">
          <h1 className="profile-title">My Profile</h1>

          {loading ? (
            <div className="loading">Loading profile...</div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <button className="retry-btn" onClick={fetchUserProfile}>
                Retry
              </button>
            </div>
          ) : (
            <>
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
                            name="contact_number"
                            value={editedDetails.contact_number}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <p>{userDetails.contact_number}</p>
                        )}
                      </div>

                      <div className="form-group">
                        <label>Address</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="location"
                            value={editedDetails.location}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <p>{userDetails.location}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Orders Section - Now just a navigation button */}
              <div className="profile-section">
                <div className="section-header" onClick={goToOrders}>
                  <div className="header-content">
                    <Package className="section-icon" />
                    <h2>My Orders</h2>
                  </div>
                  <ChevronDown />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyProfile;

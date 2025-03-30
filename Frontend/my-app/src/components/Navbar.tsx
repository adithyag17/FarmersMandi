// src/components/Navbar.tsx

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/components/Navbar.scss";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Check for token in localStorage and fetch user profile on component mount
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);

      // If logged in, fetch profile to check admin status
      if (token) {
        fetchUserProfile();
      } else {
        setIsAdmin(false);
      }
    };

    checkLoginStatus();

    // Optional: Set up a listener for storage changes
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  // Function to fetch user profile and check if admin
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        // Check if user role is 1 (admin)
        setIsAdmin(userData.role === 1);
      } else {
        console.error("Failed to fetch user profile");
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setIsAdmin(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("tokenExpiration");
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/");
    setIsMenuOpen(false); // Close mobile menu on logout
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/home" className="navbar-logo">
          Farmers Mandi
        </Link>

        <div className="navbar-mobile-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <li className="navbar-item">
            <Link to="/home" className="navbar-link">
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/about-us" className="navbar-link">
              About
            </Link>
          </li>

          {isLoggedIn ? (
            // Show logout button if token exists
            <>
              {/* Admin Dashboard link - only visible if user is admin */}
              {isAdmin && (
                <li className="navbar-item">
                  <Link to="/admin-orders" className="navbar-link">
                    Admin Dashboard
                  </Link>
                </li>
              )}
              {isAdmin && (
                <li className="navbar-item">
                  <Link to="/admin/products" className="navbar-link">
                    Admin Product Ingestor
                  </Link>
                </li>
              )}
              <li className="navbar-item">
                <Link to="/cart" className="navbar-link">
                  Cart
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/My-profile" className="navbar-link">
                  MyProfile
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/myorders" className="navbar-link">
                  MyOrders
                </Link>
              </li>
              <li className="navbar-item">
                <button onClick={handleLogout} className="button secondary">
                  Logout
                </button>
              </li>
            </>
          ) : (
            // Show login and signup buttons if no token
            <li className="navbar-item navbar-buttons">
              <Link to="/login" className="button secondary">
                Log In
              </Link>
              <Link to="/signup" className="button">
                Sign Up
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

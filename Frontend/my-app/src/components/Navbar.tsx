// src/components/Navbar.tsx

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/components/Navbar.scss";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check for token in localStorage on component mount and when it might change
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();

    // Optional: Set up a listener for storage changes
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("tokenExpiration");
    setIsLoggedIn(false);
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
          <li className="navbar-item navbar-buttons">
            {isLoggedIn ? (
              // Show logout button if token exists
              <>
                <li className="navbar-item">
                  <Link to="/cart" className="nav-link">
                    Cart
                  </Link>
                </li>
                <button onClick={handleLogout} className="button secondary">
                  <Link to="/" className="navbar-link">
                    Logout
                  </Link>
                </button>
              </>
            ) : (
              // Show login and signup buttons if no token
              <>
                <Link to="/login" className="button secondary">
                  Log In
                </Link>
                <Link to="/signup" className="button">
                  Sign Up
                </Link>
              </>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

// src/components/Navbar.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/components/Navbar.scss";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          Farmers Mandi
        </Link>

        <div className="navbar-mobile-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <li className="navbar-item">
            <Link to="/" className="navbar-link">
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/about-us" className="navbar-link">
              About
            </Link>
          </li>
          <li className="navbar-item navbar-buttons">
            <Link to="/login" className="button secondary">
              Log In
            </Link>
            <Link to="/signup" className="button">
              Sign Up
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/cart" className="nav-link">
              Cart
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

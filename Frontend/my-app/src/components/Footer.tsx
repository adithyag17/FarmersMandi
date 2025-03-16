// src/components/Footer.tsx

import { Link } from "react-router-dom";
import "../styles/components/Footer.scss";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Farmers Mandi</h3>
            <p className="footer-description">
              A simple description of your application and what it does.
            </p>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Connect</h3>
            <ul className="footer-social">
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Email id :
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Contact Number :
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  GST In:
                </a>
              </li>
              <li>Address :</li>
            </ul>
          </div>
          <div className="footer-section">
            <h3 className="footer-title">Legal</h3>
            <ul className="footer-links">
              <li>
                <Link to="/terms">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Farmers Mandi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

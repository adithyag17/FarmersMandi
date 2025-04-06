// src/components/Footer.tsx
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
              Your One-Stop Shop for Freshness & Savings!.
            </p>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Connect</h3>
            <ul className="footer-social">
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Email id : adithyag020@gmail.com
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Contact Number : 8618991772
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  GST In: 29AAKFF3797P1ZC
                </a>
              </li>
              <li>
                Address : NO.414 & 415 Banashankari 5th stage vaddarapalya
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

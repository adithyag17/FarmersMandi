// src/pages/AboutUs.tsx

import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/pages/AboutUs.scss"; // We'll create this stylesheet

const AboutUs = () => {
  return (
    <div className="about-page">
      <Navbar />

      <div className="container">
        <section className="hero-section">
          <h1 className="page-title">About Us</h1>
          <p className="page-subtitle">
            Welcome to Farmers Mandi! We bridge the gap between farmers and
            consumers by providing a simple, direct, and transparent
            marketplace. Our mission is to support local farmers and give
            consumers access to fresh, high-quality produce at fair prices.
          </p>
        </section>

        <section className="founders-section">
          <h2 className="section-title">Our Founders</h2>
          <div className="founders-container">
            <div className="founder-card">
              <div className="founder-image">
                <img src="/api/placeholder/300/300" alt="John Doe" />
              </div>
              <div className="founder-info">
                <h3 className="founder-name">John Doe</h3>
                <p className="founder-title">Co-Founder & CEO</p>
                <p className="founder-bio">
                  Visionary behind the platform, with 10+ years of agricultural
                  tech experience. John has worked extensively with farming
                  communities across the country to understand their challenges
                  and build solutions that address their needs.
                </p>
              </div>
            </div>

            <div className="founder-card">
              <div className="founder-image">
                <img src="/api/placeholder/300/300" alt="Jane Smith" />
              </div>
              <div className="founder-info">
                <h3 className="founder-name">Jane Smith</h3>
                <p className="founder-title">Co-Founder & CMO</p>
                <p className="founder-bio">
                  Marketing expert focused on promoting sustainable farming
                  practices. Jane brings her passion for organic farming and
                  consumer education to help build bridges between producers and
                  conscious consumers.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="offerings-section">
          <h2 className="section-title">What We Offer</h2>

          <div className="offering-item">
            <div className="offering-content">
              <h3 className="offering-title">Quality Products</h3>
              <p className="offering-description">
                We pride ourselves on providing fresh, high-quality produce
                directly from local farms. Every item on our platform is
                carefully selected to ensure you receive the best quality food
                for your family. Our farmers follow sustainable practices that
                maintain soil health and biodiversity while growing nutritious
                food.
              </p>
              <ul className="offering-features">
                <li>Seasonal produce at peak freshness</li>
                <li>Direct farm-to-table supply chain</li>
                <li>Rigorous quality standards</li>
              </ul>
            </div>
            <div className="offering-image">
              <img src="/api/placeholder/400/300" alt="Quality Products" />
            </div>
          </div>

          <div className="offering-item reverse">
            <div className="offering-content">
              <h3 className="offering-title">Inexpensive Pricing</h3>
              <p className="offering-description">
                By eliminating middlemen, we ensure fair, competitive prices
                that benefit both farmers and consumers. Farmers earn more for
                their hard work, while you pay less for fresh, high-quality
                produce. Our transparent pricing model means you'll always know
                exactly what you're paying for.
              </p>
              <ul className="offering-features">
                <li>Up to 40% savings compared to retail prices</li>
                <li>Subscription options for additional discounts</li>
                <li>Bulk purchase options for families</li>
              </ul>
            </div>
            <div className="offering-image">
              <img src="/api/placeholder/400/300" alt="Inexpensive Pricing" />
            </div>
          </div>

          <div className="offering-item">
            <div className="offering-content">
              <h3 className="offering-title">Exclusive Organic Products</h3>
              <p className="offering-description">
                Our handpicked, pesticide-free, organic goods are grown with
                care and respect for the environment. We work with certified
                organic farmers who are passionate about sustainable agriculture
                and biodiversity. Our organic selection includes rare and
                heirloom varieties you won't find in regular supermarkets.
              </p>
              <ul className="offering-features">
                <li>Certified organic produce and products</li>
                <li>Seasonal and heirloom varieties</li>
                <li>Pesticide and GMO-free guarantee</li>
              </ul>
            </div>
            <div className="offering-image">
              <img src="/api/placeholder/400/300" alt="Organic Products" />
            </div>
          </div>

          <div className="offering-item reverse">
            <div className="offering-content">
              <h3 className="offering-title">One-Day Delivery</h3>
              <p className="offering-description">
                Enjoy fast and reliable delivery service right to your doorstep.
                Our logistics network is optimized to maintain the freshness of
                produce from farm to your kitchen. We understand that freshness
                matters, which is why we've invested in a cold chain that
                preserves quality throughout the delivery process.
              </p>
              <ul className="offering-features">
                <li>Same-day delivery in select areas</li>
                <li>Temperature-controlled transportation</li>
                <li>Eco-friendly packaging options</li>
              </ul>
            </div>
            <div className="offering-image">
              <img src="/api/placeholder/400/300" alt="Fast Delivery" />
            </div>
          </div>
        </section>

        <section className="mission-section">
          <div className="mission-content">
            <h2 className="section-title">Our Mission</h2>
            <p className="mission-text">
              Our platform is designed to benefit both farmers and consumers,
              making local markets more accessible, efficient, and rewarding. We
              believe in creating a sustainable food ecosystem that supports
              local agriculture, reduces food miles, and connects people with
              the source of their food.
            </p>
            <div className="mission-actions">
              <Link to="/signup" className="button primary">
                Join Our Community
              </Link>
              <Link to="/" className="button secondary">
                Explore Products
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;

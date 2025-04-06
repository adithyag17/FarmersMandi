import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/pages/AboutUs.scss";

const AboutUs = () => {
  return (
    <div className="about-page">
      <Navbar />

      <div className="container">
        <section className="hero-section">
          <h1 className="page-title">About Us</h1>
          <p className="page-subtitle">
            Welcome to the official website of Farmer's Mandi Shop! Our primary
            goal is to deliver high-quality food, groceries, and products at the
            most competitive prices. Shop with us for fresh, reliable goods
            straight from the source!
          </p>
        </section>

        <section className="founders-section">
          <h2 className="section-title">Our Founders</h2>
          <div className="founders-container">
            <div className="founder-card">
              <div className="founder-image">
                <img src="vg.png" alt="VG" />
              </div>
              <div className="founder-info">
                <h3 className="founder-name">Ganesh V</h3>
                <p className="founder-title">Co-Founder</p>
                <p className="founder-bio">
                  Meet Ganesh V, a key partner at Farmer's Mandi Shop. After
                  years of searching for his true passion and purpose, Ganesh
                  discovered his calling in the world of food products. From the
                  start of his career, he dreamed of working closely with
                  quality ingredients. An avid cook himself, Ganesh's love for
                  food makes him the perfect person to handpick your groceries,
                  ensuring you get nothing but the best!
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="offerings-section">
          <h2 className="section-title">What We Offer</h2>

          <div className="offering-item">
            <div className="offering-content">
              <h3 className="offering-title">Quality Organic Products</h3>
              <p className="offering-description">
                We pride ourselves on providing fresh, high-quality organic
                produce directly from local farms. Every item on our platform is
                carefully selected to ensure you receive the best quality food
                for your family. Our farmers follow sustainable practices that
                maintain soil health and biodiversity while growing nutritious
                food.
              </p>
              <ul className="offering-features">
                <li>Seasonal produce at peak freshness</li>
                <li>Direct farm-to-table supply chain</li>
                <li>Rigorous quality standards</li>
                <li>Premium organic daily provisions</li>
              </ul>
            </div>
          </div>

          <div className="offering-item reverse">
            <div className="offering-content">
              <h3 className="offering-title">
                Wholesale Prices, Retail Smiles!
              </h3>
              <p className="offering-description">
                By eliminating middlemen, we ensure wholesale prices that are
                significantly less compared to other shops and online vendors.
                Farmers earn more for their hard work, while you pay less for
                fresh, high-quality produce. Our transparent pricing model means
                you'll always know exactly what you're paying for.
              </p>
              <ul className="offering-features">
                <li>Up to 40% savings compared to retail prices</li>
                <li>Subscription options for additional discounts</li>
                <li>Bulk purchase options for families</li>
                <li>Unbeatable wholesale rates for retail quantities</li>
              </ul>
            </div>
          </div>

          {/* <div className="offering-item">
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
                <li>
                  Premium Paneer Perfection - creamy, fresh, and priced just
                  right!
                </li>
              </ul>
            </div>
          </div> */}

          <div className="offering-item reverse">
            <div className="offering-content">
              <h3 className="offering-title">One-Day Delivery</h3>
              <p className="offering-description">
                Enjoy fast and reliable delivery service right to your doorstep
                with no minimum order required.
              </p>
              <ul className="offering-features">
                <li>FREE delivery for Mantri Alpine residents</li>
                <li>Same-day delivery service</li>
                <li>Eco-friendly packaging options</li>
                <li>
                  No minimum order – we bring freshness to your doorstep,
                  anytime, anywhere
                </li>
              </ul>
            </div>
          </div>

          <div className="offering-item">
            <div className="offering-content">
              <h3 className="offering-title">Homemade Specialties</h3>
              <p className="offering-description">
                Indulge in our range of homemade delights prepared with
                traditional recipes and premium ingredients.
              </p>
              <ul className="offering-features">
                <li>Mouthwatering pickles & condiments</li>
                <li>Crunchy Hapala</li>
                <li>Traditional Sandige</li>
                <li>And many more homemade delights</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mission-section">
          <div className="mission-content">
            <h2 className="section-title">Our Mission</h2>
            <p className="mission-text">
              Our main goal is to provide quality groceries and food products at
              the best possible rate.
            </p>
            <div className="mission-actions">
              <Link to="/signup" className="button primary">
                Join Our Community
              </Link>
              <Link to="/home" className="button secondary">
                Explore Products
              </Link>
            </div>
          </div>
        </section>

        <section className="grand-opening-section">
          <div className="grand-opening-content">
            <h2 className="section-title">Grand Opening Alert!</h2>
            <p className="opening-date">14th April 2025</p>
            <p className="opening-location">
              Opposite Mantri Alpine Apartments
            </p>
            <div className="opening-actions">
              <Link to="/home" className="button primary">
                Order Online Now!
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

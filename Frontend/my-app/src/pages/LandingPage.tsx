// src/pages/LandingPage.tsx

import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/pages/LandingPage.scss";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Navbar />

      <header className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to Farmers Mandi</h1>
            <p className="hero-subtitle">
              A simple, elegant solution for your needs. Designed to make your
              life easier.
            </p>
            <div className="hero-buttons">
              <Link to="/signup" className="button large">
                Get Started
              </Link>
              <Link to="/about-us" className="button large secondary">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="features">
        <div className="container">
          <h2 className="section-title">What we offer</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3 className="feature-title">Feature One</h3>
              <p className="feature-description">
                Description of your first amazing feature and how it benefits
                users.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Feature Two</h3>
              <p className="feature-description">
                Description of your second amazing feature and how it benefits
                users.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Feature Three</h3>
              <p className="feature-description">
                Description of your third amazing feature and how it benefits
                users.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3 className="step-title">Create an Account</h3>
              <p className="step-description">
                Sign up in seconds and set up your profile with our easy
                onboarding process.
              </p>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <h3 className="step-title">Configure Your Settings</h3>
              <p className="step-description">
                Customize the application to match your specific needs and
                preferences.
              </p>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <h3 className="step-title">Enjoy the Benefits</h3>
              <p className="step-description">
                Start using all the features and see how much easier your life
                becomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2 className="cta-title">Ready to Get Started?</h2>
          <p className="cta-description">
            Join thousands of satisfied users who have transformed their
            workflow.
          </p>
          <Link to="/signup" className="button large">
            Sign Up Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;

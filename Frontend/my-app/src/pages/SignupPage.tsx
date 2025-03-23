// src/pages/SignupPage.tsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { signup } from "../services/authService";
import "../styles/pages/AuthPages.scss";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  contactNumber: string;
  location: string;
  agreeTerms: boolean;
}

interface FormErrors {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  contactNumber: string;
  location: string;
  agreeTerms: string;
  general: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  contact_number?: string;
  location?: string;
  role: number;
}

interface ApiError {
  response?: {
    data?: {
      detail?: string;
    };
  };
  message: string;
}

const SignupPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    location: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    location: "",
    agreeTerms: "",
    general: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (name in errors && errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = (): boolean => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    // Validate contact number (optional but must be valid if provided)
    if (
      formData.contactNumber &&
      !/^\+?[0-9]{10,15}$/.test(formData.contactNumber)
    ) {
      newErrors.contactNumber = "Please enter a valid phone number";
      isValid = false;
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and conditions";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      setIsLoading(true);
      try {
        // Prepare data for API (excluding confirmPassword and agreeTerms)
        const userData: SignupData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 2, // Default role
        };

        // Add optional fields only if they have values
        if (formData.contactNumber) {
          userData.contact_number = formData.contactNumber;
        }

        if (formData.location) {
          userData.location = formData.location;
        }

        // Call signup service
        await signup(userData);

        // Redirect to dashboard or home page
        navigate("/login");
      } catch (error) {
        // Handle different error scenarios
        const apiError = error as ApiError;

        if (apiError.response?.data?.detail) {
          // API returned an error message
          setErrors({
            ...errors,
            general:
              apiError.response.data.detail ||
              "Registration failed. Please try again.",
          });
        } else {
          setErrors({
            ...errors,
            general:
              "An error occurred. Please check your connection and try again.",
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="auth-page">
      <Navbar />

      <div className="container auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Create Account</h1>

          {errors.general && (
            <div className="error-alert">{errors.general}</div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                disabled={isLoading}
              />
              {errors.name && <p className="error-message">{errors.name}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={isLoading}
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number</label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Enter your phone number"
                disabled={isLoading}
              />
              {errors.contactNumber && (
                <p className="error-message">{errors.contactNumber}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="location">Address</label>
              <textarea
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter your address"
                disabled={isLoading}
                rows={3}
              />
              {errors.location && (
                <p className="error-message">{errors.location}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="error-message">{errors.password}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="error-message">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label terms-checkbox">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <span>
                  I agree to the <Link to="/terms">Terms of Service</Link> and{" "}
                  <Link to="/privacy">Privacy Policy</Link>
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="error-message">{errors.agreeTerms}</p>
              )}
            </div>

            <button
              type="submit"
              className="button auth-button"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login">Log In</Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SignupPage;

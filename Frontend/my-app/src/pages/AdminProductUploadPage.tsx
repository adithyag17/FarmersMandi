// src/pages/AdminProductUploadPage.tsx

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/pages/AdminProductUploadPage.scss";
import { useNavigate } from "react-router-dom";

// Define interfaces for the API response
interface Product {
  id: string; // or number depending on your backend
  name: string;
  // Add other product properties that might be in your response
  // For example: price?: number, category?: string, etc.
}

interface ProductUploadResponse {
  message?: string;
  products?: Product[];
  added?: number;
  updated?: number;
  failed?: number;
}

const AdminProductUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [responseData, setResponseData] =
    useState<ProductUploadResponse | null>(null);
  const navigate = useNavigate();

  // Updated to match your backend endpoint
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const API_URL = `${API_BASE_URL}/admin/IngestProducts`;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
      setSuccess(null);
      setResponseData(null);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please select an Excel file");
      return;
    }

    // Validate file type
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setError("Please upload an Excel file (.xlsx or .xls)");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Create FormData to send file
      const formData = new FormData();
      formData.append("file", file);

      // Get auth token from localStorage
      const token = localStorage.getItem("token");

      // Send the file to the backend
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          // Include Authorization header if token exists
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      // Check for authentication issues
      if (response.status === 401 || response.status === 403) {
        if (response.status === 403) {
          setError("Permission denied. Admin access required.");
        }
        navigate("/login");
        return;
      }

      // Handle other error responses
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to upload file");
      }

      // Successfully received response
      const result = await response.json();

      // Log response data to console
      console.log("Upload response from backend:", result);

      // Store the response data for display
      setResponseData(result);

      // Show success message
      setSuccess(
        `File uploaded successfully! ${
          result.message || "Products have been updated."
        }`
      );
    } catch (err) {
      console.error("File upload failed:", err);
      setError(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-product-upload-page">
      <Navbar />

      <div className="container">
        <h1 className="page-title">Admin Product Management</h1>

        <div className="upload-section">
          <div className="upload-card">
            <div className="card-header">
              <h2>Upload Products Excel File</h2>
              <p>
                Upload an Excel file (.xlsx or .xls) to add or update products
                in the database.
              </p>
            </div>

            <form onSubmit={handleFileUpload} className="upload-form">
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="excel-file"
                  onChange={handleFileChange}
                  accept=".xlsx,.xls"
                />
                <label htmlFor="excel-file">
                  {file ? file.name : "Choose Excel File"}
                </label>
                {file && (
                  <div className="file-details">
                    <p>File: {file.name}</p>
                    <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                )}
              </div>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <button
                type="submit"
                className="upload-button"
                disabled={!file || loading}
              >
                {loading ? "Uploading..." : "Upload Products"}
              </button>
            </form>
          </div>

          {responseData && (
            <div className="preview-card">
              <div className="card-header">
                <h2>Upload Results</h2>
                <p>Response from backend after file processing</p>
              </div>

              <div className="data-preview">
                <div className="response-data">
                  <pre>{JSON.stringify(responseData, null, 2)}</pre>
                </div>

                {responseData.products && responseData.products.length > 0 && (
                  <div className="products-summary">
                    <h3>Products Summary</h3>
                    <p>
                      Total products processed: {responseData.products.length}
                    </p>
                    {responseData.added && <p>Added: {responseData.added}</p>}
                    {responseData.updated && (
                      <p>Updated: {responseData.updated}</p>
                    )}
                    {responseData.failed && (
                      <p>Failed: {responseData.failed}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="navigation-buttons">
          <button
            className="nav-button"
            onClick={() => navigate("/admin/dashboard")}
          >
            Back to Dashboard
          </button>
          <button
            className="nav-button"
            onClick={() => navigate("/admin/orders")}
          >
            Manage Orders
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminProductUploadPage;

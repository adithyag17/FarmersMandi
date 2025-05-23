// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AboutUs from "./pages/AboutUs";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import MyProfile from "./pages/MyProfile";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminProductUploadPage from "./pages/AdminProductUploadPage";
import "./styles/main.scss";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/My-Profile" element={<MyProfile />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/myorders" element={<MyOrdersPage />} />
        <Route path="/admin-orders" element={<AdminOrdersPage />} />
        <Route path="/admin/products" element={<AdminProductUploadPage />} />
      </Routes>
    </Router>
  );
}

export default App;

// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AboutUs from "./pages/AboutUs";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
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
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </Router>
  );
}

export default App;

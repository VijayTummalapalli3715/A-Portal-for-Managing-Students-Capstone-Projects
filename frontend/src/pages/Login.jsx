import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles.css"; // Ensure styles are correctly imported

const Login = () => {
  const navigate = useNavigate();
  
  // State for input fields
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    try {
      const response = await fetch(`${BACKEND_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Login successful!");
        navigate("/home"); // Redirect user after successful login
      } else {
        alert(data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      {/* Navbar */}
      <header className="navbar">
        <h1>Capstone Project Management Portal</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/signup">Sign Up</a>
          <a href="/about">About</a>
          <a href="/home" className="btn-primary">Get Started</a>
        </nav>
      </header>

      {/* Back Button */}
      <div className="back-button">
        <button onClick={() => navigate(-1)}>← Back</button>
      </div>

      {/* Login Form */}
      <div className="page-container">
        <h2>Login</h2>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />

            <label>Password:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />

            <button type="submit" className="btn">Login</button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Capstone Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;

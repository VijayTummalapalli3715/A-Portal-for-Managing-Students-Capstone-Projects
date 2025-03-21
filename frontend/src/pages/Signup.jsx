import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles.css"; // Ensure styles are correctly imported

const Signup = () => {
  const navigate = useNavigate();

  // State for input fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student", // Default role
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
      const response = await fetch(`${BACKEND_URL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("📩 Response from Backend:", data); // Debugging step

      if (response.ok) {
        alert("✅ Registration successful!");
        navigate("/login"); // Redirect user after successful registration
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (error) {
      console.error("❌ Network Error:", error);
      alert("❌ Failed to connect to the server.");
    }
  };

  return (
    <div>
      {/* Navbar */}
      <header className="navbar">
        <h1>Capstone Project Management Portal</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/login">Login</a>
          <a href="/about">About</a>
          <a href="/home" className="btn-primary">Get Started</a>
        </nav>
      </header>

      {/* Signup Form */}
      <div className="page-container">
        <h2>Sign Up</h2>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />

            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />

            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />

            <label htmlFor="role">Role:</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange} required>
              <option value="Student">Student</option>
              <option value="Instructor">Instructor</option>
              <option value="Client">Client</option>
            </select>

            <button type="submit" className="btn">Sign Up</button>
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

export default Signup;

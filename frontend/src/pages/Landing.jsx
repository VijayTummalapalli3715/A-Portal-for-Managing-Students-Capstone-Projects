import React from "react";
import { Link } from "react-router-dom";
import "./../styles.css"; // Ensure styles are correctly imported

const Landing = () => {
  return (
    <div>
      {/* Navbar */}
      <header className="navbar">
        <h1>Capstone Project Management Portal</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/about">About</Link>
          <Link to="/home" className="btn-primary">Get Started</Link>
        </nav>
      </header>

      {/* Main Content */}
      <section className="landing-container">
        <h1>Welcome to A Portal for Managing Students Capstone Projects</h1>
        <p>Your one-stop platform for connecting students, instructors, and clients.</p>
        <Link to="/home" className="btn">Get Started</Link>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Capstone Portal. All rights reserved.</p>
        <p>Contact us: <a href="mailto:support@capstoneportal.com">support@capstoneportal.com</a> | Phone: 123-456-7890</p>
      </footer>
    </div>
  );
};

export default Landing;

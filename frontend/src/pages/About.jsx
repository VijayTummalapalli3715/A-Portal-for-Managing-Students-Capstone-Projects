import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles.css"; // Ensure styles are imported correctly

const About = () => {
  const navigate = useNavigate();

  // State for form input
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Message Sent:", formData);
    alert("Your message has been sent!");
    setFormData({ firstName: "", lastName: "", email: "", message: "" });
  };

  return (
    <div>
      {/* Navbar */}
      <header className="navbar">
        <h1>Capstone Project Management Portal</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/Login">Login</a>
          <a href="/about">About</a>
          <a href="/home" className="btn-primary">Get Started</a>
        </nav>
      </header>

      {/* Back Button */}
      <div className="back-button">
        <button onClick={() => navigate(-1)}>← Back</button>
      </div>

      {/* About Us Section */}
      <section className="about-container">
        <h2>Meet Our Team</h2>
        <div className="team-members">
          <div className="team-card">
            <h3>Sree Rama Vijay Tummalapalli</h3>
            <a href="https://github.com/VijayTummalapalli3715" target="_blank" rel="noopener noreferrer">GitHub Profile</a>
            <a href="https://www.linkedin.com/in/sree-rama-vijay-tummalapalli-aabb91204/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
          <div className="team-card">
            <h3>Sireesha Kuchimanchi</h3>
            <a href="https://github.com/Sireesha2002" target="_blank" rel="noopener noreferrer">GitHub Profile</a>
            <a href="https://www.linkedin.com/in/sireesha-kuchimanchi-0959a41b3/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
          <div className="team-card">
            <h3>Gopi Krishna Nathani</h3>
            <a href="https://github.com/gopikrishna2313" target="_blank" rel="noopener noreferrer">GitHub Profile</a>
            <a href="https://www.linkedin.com/in/gopi-krishna-nathani44/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="contact-container">
        <div className="contact-info">
          <h2>Do you have a question?</h2>
          <p>We’re here to help.</p>
          <p>📍 100 Morrissey Blvd, Boston, MA 02125</p>
          <p>📧 <a href="mailto:support@capstoneportal.com">support@capstoneportal.com</a></p>
          <p>📞 1-123-456-7890</p>
        </div>

        <div className="contact-form">
          <h2>Contact Us</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
            <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <textarea name="message" placeholder="Message" value={formData.message} onChange={handleChange} required />
            <button type="submit" className="btn">Send Message</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Capstone Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default About;

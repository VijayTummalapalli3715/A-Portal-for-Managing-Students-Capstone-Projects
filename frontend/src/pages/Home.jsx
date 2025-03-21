import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles.css"; // Ensure styles are imported correctly

const Home = () => {
  const navigate = useNavigate();
  const [isStudentPopupOpen, setStudentPopupOpen] = useState(false);

  // Open Student Popup
  const showStudentPopup = () => {
    setStudentPopupOpen(true);
  };

  // Close Popup
  const closePopup = (event) => {
    if (event.target.className === "popup-message" || event.target.className === "close-popup") {
      setStudentPopupOpen(false);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <header className="navbar">
        <h1>Welcome! Are you an Instructor, Student, or Client?</h1>
      </header>

      {/* Back Button */}
      <div className="back-button">
        <button onClick={() => navigate(-1)}>← Back</button>
      </div>

      {/* Card Container */}
      <div className="card-container">
        <div className="card">
          <img src="/images/Instructor.png" alt="Instructor" className="card-image" />
          <h2>Instructor</h2>
          <p>
            I aim to establish connections with companies to ensure my learners can gain real-world experiences.
          </p>
          <a href="/signup?role=instructor" className="btn">Sign Up as Instructor</a>
        </div>

        <div className="card">
          <img src="/images/Student.png" alt="Student" className="card-image" />
          <h2>Student</h2>
          <p>I want to work with companies by completing projects and gaining relevant skills.</p>
          <button className="btn" onClick={showStudentPopup}>Sign Up as Student</button>
        </div>

        <div className="card">
          <img src="/images/Client.png" alt="Client" className="card-image" />
          <h2>Client</h2>
          <p>
            In order to build relationships with students, I plan to have them work on projects for my business.
          </p>
          <a href="/signup?role=client" className="btn">Sign Up as Client</a>
        </div>
      </div>

      {/* Student Signup Popup */}
      {isStudentPopupOpen && (
        <div className="popup-message" onClick={closePopup}>
          <div className="popup-content">
            <p>Please contact the instructor for further details.</p>
            <button className="close-popup" onClick={closePopup}>OK</button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Capstone Portal. All rights reserved.</p>
        <p>Contact us: <a href="mailto:support@capstoneportal.com">support@capstoneportal.com</a> | Phone: 123-456-7890</p>
      </footer>
    </div>
  );
};

export default Home;

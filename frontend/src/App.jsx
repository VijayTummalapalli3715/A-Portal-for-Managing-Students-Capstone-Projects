import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import InstructorDashboard from "./pages/InstructorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import CreateProject from "./pages/CreateProject";
import Projects from "@/pages/Projects";

import "./styles.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/client/dashboard" element={<ClientDashboard />} /> 
        <Route path="/client/projects" element={<Projects />} />
      </Routes>
    </Router>
  );
}

export default App;

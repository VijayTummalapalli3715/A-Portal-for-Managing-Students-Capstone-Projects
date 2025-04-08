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
import ViewProjects from "@/pages/ViewProjects";
import ProvidePreferences from "@/pages/ProvidePreferences";
import AssignedProjects from "./pages/AssignedProjects";

import AuthProvider from "./context/AuthProvider"; // ✅ Wrap app in this
import "./styles.css";

function App() {
  return (
    <AuthProvider>
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
          <Route path="/student/view-projects" element={<ViewProjects />} />
          <Route path="/student/provide-preferences" element={<ProvidePreferences />} />
          <Route path="/student/assigned-projects" element={<AssignedProjects />} />
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/client/projects" element={<Projects />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

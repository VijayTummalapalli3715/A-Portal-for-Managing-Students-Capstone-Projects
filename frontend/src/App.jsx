import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import InstructorDashboard from "./instructer/InstructorDashboard";
import StudentDashboard from "./student/StudentDashboard";
import ClientDashboard from "./client/ClientDashboard";
import CreateProject from "./client/CreateProject";
import Projects from "./client/Projects";
import ViewProjects from "@/student/ViewProjects";
import ProvidePreferences from "@/student/ProvidePreferences";
import AssignedProjects from "./student/AssignedProjects";
import { Toaster } from "sonner";

import AuthProvider from "./context/AuthProvider"; // ✅ Wrap app in this
import "./styles.css";
import Teams from "./client/Teams";
import Achievements from "./client/Achievements";
import Bookmarks from "./client/Bookmarks";

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
          <Route path="/client/teams" element={<Teams />} />
          <Route path="/client/achievements" element={<Achievements />} />
          <Route path="/client/bookmarks" element={<Bookmarks />} />
          <Route path="/edit-project/:projectId" element={<CreateProject />} />

         
          
        </Routes>
      </Router>
      <Toaster richColors />
    </AuthProvider>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import InstructorDashboard from "./instructor/InstructorDashboard";
import StudentDashboard from "./student/StudentDashboard";
import ClientDashboard from "./client/ClientDashboard";
import CreateProject from "./client/CreateProject";
import Projects from "./client/Projects";
import ViewProjects from "@/student/ViewProjects";
import ProvidePreferences from "@/student/ProvidePreferences";
import AssignedProjects from "./student/AssignedProjects";
import { Toaster } from "sonner";
import InstructorProjectDetails from "./instructor/InstructorProjectDetails";

import AuthProvider from "./context/AuthProvider"; // ✅ Wrap app in this
import "./styles.css";
import Teams from "./client/Teams";

// Import instructor components (you'll need to create these files)
import InstructorStudents from "./instructor/InstructorStudents";
import InstructorEvaluations from "./instructor/InstructorEvaluations";
import InstructorAnnouncements from "./instructor/InstructorAnnouncements";
import InstructorAddStudent from "./instructor/InstructorAddStudent";
import InstructorCreateProject from "./instructor/InstructorCreateProject";
import InstructorCreateAnnouncement from "./instructor/InstructorCreateAnnouncement";
import InstructorScheduleEvaluation from "./instructor/InstructorScheduleEvaluation";
import InstructorGroups from "./instructor/InstructorGroups";
import InstructorProfile from "./instructor/InstructorProfile";
import StudentsList from "./instructor/StudentsList";
import AddStudent from "./instructor/AddStudent";
import Groups from "./instructor/Groups";
import CreateGroup from "./instructor/CreateGroup";
import InstructorProjects from "./instructor/InstructorProjects";

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
          
          {/* Instructor Routes */}
          <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
          <Route path="/instructor/students" element={<StudentsList />} />
          <Route path="/instructor/students/add" element={<AddStudent />} />
          <Route path="/instructor/evaluations" element={<InstructorEvaluations />} />
          <Route path="/instructor/evaluations/schedule" element={<InstructorScheduleEvaluation />} />
          <Route path="/instructor/announcements" element={<InstructorAnnouncements />} />
          <Route path="/instructor/announcements/create" element={<InstructorCreateAnnouncement />} />
          <Route path="/instructor/projects" element={<InstructorProjects />} />
          <Route path="/instructor/projects/create" element={<InstructorCreateProject />} />
          <Route path="/instructor/projects/:id" element={<InstructorProjectDetails />} />
          <Route path="/instructor/groups" element={<Groups />} />
          <Route path="/instructor/groups/create" element={<CreateGroup />} />
          <Route path="/instructor/profile" element={<InstructorProfile />} />
          
          {/* Student Routes */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/view-projects" element={<ViewProjects />} />
          <Route path="/student/provide-preferences" element={<ProvidePreferences />} />
          <Route path="/student/assigned-projects" element={<AssignedProjects />} />
          
          {/* Client Routes */}
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/client/projects" element={<Projects />} />
          <Route path="/client/teams" element={<Teams />} />
          <Route path="/edit-project/:projectId" element={<CreateProject />} />
        </Routes>
      </Router>
      <Toaster richColors />
    </AuthProvider>
  );
}

export default App;

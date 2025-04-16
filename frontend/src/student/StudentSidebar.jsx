import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const StudentSidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-blue-900 text-white min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">Student Portal</h2>
      <nav className="flex flex-col space-y-3">
        <Button variant="ghost" onClick={() => navigate("/student/dashboard")} className="justify-start text-left text-white">
          Dashboard
        </Button>
        <Button variant="ghost" onClick={() => navigate("/student/view-projects")} className="justify-start text-left text-white">
          View Projects
        </Button>
        <Button variant="ghost" onClick={() => navigate("/student/provide-preferences")} className="justify-start text-left text-white">
          Provide Preferences
        </Button>
        <Button variant="ghost" onClick={() => navigate("/student/assigned-projects")} className="justify-start text-left text-white">
          Assigned Project
        </Button>
      </nav>
    </div>
  );
};

export default StudentSidebar;

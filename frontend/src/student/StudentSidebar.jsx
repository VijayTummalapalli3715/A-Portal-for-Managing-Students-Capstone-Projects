import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  BookOpen, 
  ListChecks, 
  Folder
} from "lucide-react"; // Removed GraduationCap import

const StudentSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActiveRoute = (path) => location.pathname === path;

  const menuItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5 mr-2" />,
      label: "Dashboard",
      path: "/student/dashboard"
    },
    {
      icon: <BookOpen className="w-5 h-5 mr-2" />,
      label: "View Projects",
      path: "/student/view-projects"
    },
    {
      icon: <ListChecks className="w-5 h-5 mr-2" />,
      label: "Provide Preferences",
      path: "/student/provide-preferences"
    },
    {
      icon: <Folder className="w-5 h-5 mr-2" />,
      label: "Assigned Project",
      path: "/student/assigned-projects"
    }
  ];

  return (
    <div className="bg-blue-900 h-full p-4">
      <div className="flex items-center gap-2 mb-6">
        {/* Removed GraduationCap Icon */}
        <h2 className="text-xl font-bold text-white">Student Portal</h2>
      </div>
      
      <nav className="flex flex-col space-y-1">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            onClick={() => navigate(item.path)}
            className={`justify-start text-left w-full text-white hover:bg-blue-800 ${
              isActiveRoute(item.path) ? "bg-blue-800" : ""
            }`}
          >
            {item.icon}
            {item.label}
          </Button>
        ))}
      </nav>
    </div>
  );
};

export default StudentSidebar;
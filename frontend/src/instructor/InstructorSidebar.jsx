import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  ClipboardList, 
  UsersRound, 
  UserCog,
  LogOut
} from "lucide-react";
import { toast } from "sonner";

const InstructorSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("uid");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const sidebarLinks = [
    {
      name: "Dashboard",
      path: "/instructor/dashboard",
      icon: LayoutDashboard,
      description: "Overview and analytics"
    },
    {
      name: "Students",
      path: "/instructor/students",
      icon: Users,
      description: "Manage students"
    },
    {
      name: "Projects",
      path: "/instructor/projects",
      icon: BookOpen,
      description: "View and manage projects"
    },
    {
      name: "Groups",
      path: "/instructor/groups",
      icon: UsersRound,
      description: "Manage student groups"
    },
    {
      name: "Evaluations",
      path: "/instructor/evaluations",
      icon: ClipboardList,
      description: "Schedule and manage evaluations"
    },
    {
      name: "Profile Settings",
      path: "/instructor/profile",
      icon: UserCog,
      description: "Update profile and preferences"
    }
  ];

  return (
    <aside className="w-64 bg-blue-900 text-white min-h-screen p-4 !pt-10">
      <h2 className="text-xl font-bold mb-6">Instructor Portal</h2>
      <nav className="space-y-2">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-md hover:bg-[#1e3a8a] transition group relative ${
                  isActive ? "bg-[#1e3a8a] font-semibold" : ""
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{link.name}</span>
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity whitespace-nowrap">
                {link.description}
              </div>
            </NavLink>
          );
        })}
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-md hover:bg-red-700 transition w-full mt-4 text-left"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default InstructorSidebar; 
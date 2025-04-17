import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, BookOpen, ClipboardList, Settings } from "lucide-react";

const InstructorSidebar = () => {
  const sidebarLinks = [
    { name: "Dashboard", path: "/instructor/dashboard", icon: LayoutDashboard },
    { name: "Students", path: "/instructor/students", icon: Users },
    { name: "Projects", path: "/instructor/projects", icon: BookOpen },
    { name: "Evaluations", path: "/instructor/evaluations", icon: ClipboardList },
    { name: "Settings", path: "/instructor/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-blue-900 text-white min-h-screen p-4 !pt-10">
      <h2 className="text-xl font-bold mb-6">Instructor Portal</h2>
      <ul className="space-y-2">
        {sidebarLinks.map((link, index) => {
          const Icon = link.icon;
          return (
            <li key={index}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-md hover:bg-[#1e3a8a] transition ${
                    isActive ? "bg-[#1e3a8a] font-semibold" : ""
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{link.name}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default InstructorSidebar; 
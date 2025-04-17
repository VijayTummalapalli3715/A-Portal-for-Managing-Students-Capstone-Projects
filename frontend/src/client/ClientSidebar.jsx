import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, FolderKanban, Users, Trophy, Bookmark } from "lucide-react";

const ClientSidebar = () => {
  const sidebarLinks = [
    { name: "My Dashboard", path: "/client/dashboard", icon: LayoutDashboard },
    { name: "My Projects", path: "/client/projects", icon: FolderKanban },
    { name: "My Teams", path: "/client/teams", icon: Users },
    { name: "My Achievements", path: "/client/achievements", icon: Trophy },
    { name: "My Bookmarks", path: "/client/bookmarks", icon: Bookmark },
  ];

  return (
    <aside className="w-64 bg-blue-900 text-white min-h-screen p-4 !pt-10">
      <h2 className="text-xl font-bold mb-6">Client Portal</h2>
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

export default ClientSidebar; 
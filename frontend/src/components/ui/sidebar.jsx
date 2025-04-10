import React from "react";
import { NavLink } from "react-router-dom";

const sidebarLinks = [
  { name: "My Dashboard", path: "/client/dashboard" },
  { name: "My Projects", path: "/client/projects" },
  { name: "My Teams", path: "/client/teams" },
  { name: "My Achievements", path: "/client/achievements" },
  { name: "My Bookmarks", path: "/client/bookmarks" },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-blue-900 text-white min-h-screen p-4 !pt-10">
      <h2 className="text-xl font-bold mb-6">Client Portal</h2>
      <ul className="space-y-4">
        {sidebarLinks.map((link, index) => (
          <li key={index}>
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `block p-2 rounded-md hover:bg-[#1e3a8a] transition ${
                  isActive ? "bg-[#1e3a8a] font-semibold" : ""
                }`
              }
            >
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;

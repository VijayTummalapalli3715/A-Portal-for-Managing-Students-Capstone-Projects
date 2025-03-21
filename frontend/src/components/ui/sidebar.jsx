import React from "react";

const Sidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-gray-800 text-white p-4">
      <h2 className="text-lg font-bold">Dashboard</h2>
      <ul className="mt-4">
        <li className="p-2 hover:bg-gray-700 cursor-pointer">My Dashboard</li>
        <li className="p-2 hover:bg-gray-700 cursor-pointer">My Projects</li>
        <li className="p-2 hover:bg-gray-700 cursor-pointer">My Teams</li>
        <li className="p-2 hover:bg-gray-700 cursor-pointer">My Achievements</li>
        <li className="p-2 hover:bg-gray-700 cursor-pointer">My Bookmarks</li>
      </ul>
    </div>
  );
};

export default Sidebar;

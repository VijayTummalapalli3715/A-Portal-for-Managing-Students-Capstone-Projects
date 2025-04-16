// ✅ Reusable layout for Topbar + Toggleable Sidebar
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

const TopbarWithSidebar = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Topbar */}
      <header className="fixed top-0 left-0 w-full bg-green-800 text-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-white md:hidden">
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-xl font-bold">📚 Capstone Portal</h1>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Button variant="ghost" onClick={() => navigate("/home")} className="text-white">Home</Button>
            <Button variant="ghost" onClick={() => navigate("/about")} className="text-white">About</Button>
            <Button variant="ghost" onClick={() => navigate("/login")} className="text-white">Login</Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-md" onClick={() => navigate("/signup")}>Get Started</Button>
          </nav>
        </div>
      </header>

      {/* Sidebar (Mobile) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-16 left-0 w-64 h-full bg-white shadow-lg z-40 md:hidden"
          >
            <Sidebar />
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex pt-20">
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200">
          <Sidebar />
        </aside>
        <main className="flex-1 p-6 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
};

export default TopbarWithSidebar;

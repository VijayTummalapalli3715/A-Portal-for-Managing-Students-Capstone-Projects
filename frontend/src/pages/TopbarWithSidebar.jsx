// ✅ Reusable layout for Topbar + Toggleable Sidebar
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import StudentSidebar from "@/student/StudentSidebar";
import ClientSidebar from "@/client/ClientSidebar";
import InstructorSidebar from "@/instructor/InstructorSidebar";
import { useNavigate, useLocation } from "react-router-dom";

const TopbarWithSidebar = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine which sidebar to show based on the current path
  const getSidebar = () => {
    if (location.pathname.startsWith("/client")) {
      return <ClientSidebar />;
    } else if (location.pathname.startsWith("/instructor")) {
      return <InstructorSidebar />;
    }
    return <StudentSidebar />;
  };

  const handleLogout = () => {
    // Clear any stored tokens or user data
    localStorage.removeItem("token");
    // Navigate to login page
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Topbar */}
      <header className="fixed top-0 left-0 right-0 bg-green-800 text-white shadow-md z-50">
        <div className="w-full px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)} 
              className="text-white p-2 hover:bg-green-700 rounded-md transition-colors"
              aria-label="Toggle Sidebar"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-xl font-bold">📚 Capstone Portal</h1>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-white hover:bg-green-700 p-2 rounded-md"
            aria-label="Logout"
          >
            <LogOut className="w-6 h-6" />
          </Button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && isMobile && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white shadow-lg z-40 md:hidden overflow-y-auto"
          >
            {getSidebar()}
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex pt-16 h-screen w-full">
        {/* Desktop Sidebar */}
        <aside className={`hidden md:block w-64 bg-white border-r border-gray-200 transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {getSidebar()}
        </aside>
        <main className={`flex-1 w-full transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : ''}`}>
          <div className="h-full w-full p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TopbarWithSidebar;

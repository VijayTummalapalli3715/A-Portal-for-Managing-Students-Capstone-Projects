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
  const [isSidebarOpen, setSidebarOpen] = useState(true); // Default to open on desktop
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      // Auto-close sidebar on mobile, auto-open on desktop
      setSidebarOpen(width >= 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Call on initial mount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine which sidebar to show based on the current path
  const getSidebar = () => {
    const userRole = localStorage.getItem("role");
    
    if (userRole === "Client") {
      return <ClientSidebar />;
    } else if (userRole === "Instructor") {
      return <InstructorSidebar />;
    } else if (userRole === "Student") {
      return <StudentSidebar />;
    }
    
    // Default to student sidebar if no role is found
    return <StudentSidebar />;
  };

  const handleLogout = () => {
    // Clear any stored tokens or user data
    localStorage.removeItem("token");
    // Navigate to login page
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
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

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside 
          className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-lg transition-transform duration-300 ease-in-out z-40
            ${isMobile ? 'w-64' : 'w-64'} 
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            ${isMobile ? 'md:hidden' : 'hidden md:block'}`}
        >
          {getSidebar()}
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main 
          className={`flex-1 transition-all duration-300 ease-in-out min-h-screen
            ${isSidebarOpen ? 'md:pl-64' : 'pl-0'}`}
        >
          <div className="p-6 max-w-[100%]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TopbarWithSidebar;

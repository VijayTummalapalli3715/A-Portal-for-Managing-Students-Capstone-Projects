// ✅ Refactored Landing.jsx with centered layout, modern animation and spacing
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-100 to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-green-800 text-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold">
            Capstone Project Management Portal
          </h1>
          <nav className="flex gap-4 text-sm font-semibold">
            <Button variant="ghost" onClick={() => navigate("/home")} className="text-white hover:text-yellow-300">
              Home
            </Button>
            <Button variant="ghost" onClick={() => navigate("/login")} className="text-white hover:text-yellow-300">
              Login
            </Button>
            <Button variant="ghost" onClick={() => navigate("/about")} className="text-white hover:text-yellow-300">
              About
            </Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-md"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center items-center text-center px-4 pt-32 pb-10">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
        >
          Welcome to A Portal for Managing Students Capstone Projects
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 mb-6 max-w-xl text-lg"
        >
          Your one-stop platform for connecting students, instructors, and clients.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-md shadow-md"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </Button>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-green-800 text-white text-sm py-4 text-center">
        © 2025 Capstone Portal. All rights reserved. | Contact us: {" "}
        <a href="mailto:support@capstoneportal.com" className="text-blue-300 underline">
          support@capstoneportal.com
        </a>{" "}
        | Phone: 123-456-7890
      </footer>
    </div>
  );
};

export default Landing;

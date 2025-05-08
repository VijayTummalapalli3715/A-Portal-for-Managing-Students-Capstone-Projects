// ✅ Refactored Login.jsx with topbar and toggleable sidebar support
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Sidebar from "@/components/ui/sidebar";
import { toast } from "sonner";
import api from "@/lib/api";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "", role: "Student" });
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      // 2. Get Firebase token
      const token = await userCredential.user.getIdToken();
      
      // 3. Verify with backend
      const response = await api.post("/api/user/verify", {
        role: formData.role
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const userData = response.data;

      // 4. Store necessary information
      localStorage.setItem("token", token);
      localStorage.setItem("uid", userCredential.user.uid);
      localStorage.setItem("role", userData.role);
      localStorage.setItem("userId", userData.id);

      // 5. Navigate based on role
      toast.success("Login successful!");
      if (userData.role === "Student") navigate("/student/dashboard");
      else if (userData.role === "Instructor") navigate("/instructor/dashboard");
      else if (userData.role === "Client") navigate("/client/dashboard");
      
    } catch (error) {
      console.error("Login error:", error);
      handleLoginError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginError = (error) => {
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.message.includes("auth/user-not-found")) {
      toast.error("User not registered. Please sign up first.");
    } else if (error.message.includes("auth/wrong-password") || error.message.includes("auth/invalid-credential")) {
      toast.error("Invalid email or password. Please check your credentials.");
    } else if (error.message.includes("auth/too-many-requests")) {
      toast.error("Too many failed attempts. Please try again later.");
    } else if (error.message.includes("auth/invalid-email")) {
      toast.error("Invalid email format. Please check your email address.");
    } else if (error.message.includes("auth/network-request-failed")) {
      toast.error("Network error. Please check your internet connection.");
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Topbar */}
      <header className="fixed top-0 left-0 w-full bg-green-800 text-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-white md:hidden">
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-xl font-bold">Capstone Project Management Portal</h1>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-semibold">
            <Button variant="ghost" onClick={() => navigate("/home")} className="text-white">Home</Button>
            <Button variant="ghost" onClick={() => navigate("/login")} className="text-white">Login</Button>
            <Button variant="ghost" onClick={() => navigate("/about")} className="text-white">About</Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-md" onClick={() => navigate("/signup")}>Get Started</Button>
          </nav>
        </div>
      </header>

      {/* Sidebar (Mobile only) */}
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

      <main className="flex flex-1 justify-center items-center pt-32 pb-12">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white p-10 rounded-xl shadow-lg w-full max-w-sm h-auto"
        >
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="Student">Student</option>
              <option value="Instructor">Instructor</option>
              <option value="Client">Client</option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-md"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              New to Capstone Portal?{" "}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/signup");
                }}
                className="text-orange-500 hover:text-orange-600 font-medium underline"
              >
                Create an account
              </button>
            </p>
          </div>
        </motion.form>
      </main>

      <footer className="bg-green-800 text-white text-sm py-4 text-center mt-auto">
        © 2025 Capstone Portal. All rights reserved. | Contact us: {" "}
        <a href="mailto:support@capstoneportal.com" className="text-blue-300 underline">
          support@capstoneportal.com
        </a>{" "}
        | Phone: 123-456-7890
      </footer>
    </div>
  );
};

export default Login;

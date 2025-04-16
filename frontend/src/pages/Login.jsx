// ✅ Refactored Login.jsx with clean layout, animation, and consistent input styling
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "", role: "Student" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      const token = await user.getIdToken();

      const res = await fetch("http://localhost:5006/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch user info from backend");
      const dbUser = await res.json();

      localStorage.setItem("clientId", dbUser.id);
      localStorage.setItem("token", token);
      localStorage.setItem("uid", user.uid);
      localStorage.setItem(`role-${user.uid}`, formData.role);

      if (formData.role === "Student") navigate("/student/dashboard");
      else if (formData.role === "Instructor") navigate("/instructor/dashboard");
      else if (formData.role === "Client") navigate("/client/dashboard");
    } catch (error) {
      console.error("Login failed:", error.message);
      alert("Invalid credentials or server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="fixed top-0 left-0 w-full bg-green-800 text-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-white text-sm font-semibold hover:text-yellow-300"
            >
              ←
            </Button>
            <h1 className="text-xl font-bold">Capstone Project Management Portal</h1>
          </div>
          <nav className="flex gap-6 text-sm font-semibold">
            <Button variant="ghost" onClick={() => navigate("/home")}>Home</Button>
            <Button variant="ghost" onClick={() => navigate("/login")}>Login</Button>
            <Button variant="ghost" onClick={() => navigate("/about")}>About</Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-md"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </Button>
          </nav>
        </div>
      </header>

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
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-md"
          >
            Login
          </Button>
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

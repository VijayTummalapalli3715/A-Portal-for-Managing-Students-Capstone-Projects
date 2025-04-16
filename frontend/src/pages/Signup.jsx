// ✅ Refactored Signup.jsx for modern UX and consistent styling
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { motion } from "framer-motion";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(userCredential.user, {
        displayName: formData.name,
      });

      const uid = userCredential.user.uid;
      const token = await userCredential.user.getIdToken();

      localStorage.setItem(`role-${uid}`, formData.role);
      localStorage.setItem("uid", uid);
      localStorage.setItem("token", token);

      await fetch("http://localhost:5006/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uid,
          name: formData.name,
          email: formData.email,
          role: formData.role,
        }),
      });

      alert("Registration Successful");
      navigate("/login");
    } catch (error) {
      console.error("Signup Error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-green-800 to-green-600 text-white shadow-md fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-white text-sm font-semibold hover:text-yellow-300"
            >
              ←
            </Button>
            <h1 className="text-xl md:text-2xl font-bold">Capstone Project Management Portal</h1>
          </div>
          <nav className="flex gap-4 text-sm font-semibold">
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

      <main className="flex flex-col items-center justify-center flex-1 px-6 mt-32 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md p-6 bg-white shadow-md rounded-xl"
        >
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
            Create an Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="role">Select Role</Label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="Student">Student</option>
                <option value="Instructor">Instructor</option>
                <option value="Client">Client</option>
              </select>
            </div>
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold">
              Sign Up
            </Button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            Already have an account? {" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </motion.div>
      </main>

      <footer className="bg-green-800 text-white text-sm py-4 text-center">
        © 2025 Capstone Portal. All rights reserved. | Contact us: {" "}
        <a href="mailto:support@capstoneportal.com" className="text-blue-300 underline">
          support@capstoneportal.com
        </a>{" "}
        | Phone: 123-456-7890
      </footer>
    </div>
  );
}
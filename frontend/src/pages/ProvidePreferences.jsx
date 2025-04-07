
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ProvidePreferences = () => {
  const navigate = useNavigate();
  const [preferredProjects, setPreferredProjects] = useState([]);

  useEffect(() => {
    // Retrieve preferred projects from localStorage
    const storedProjects = localStorage.getItem("preferredProjects");
    if (storedProjects) {
      try {
        const parsedProjects = JSON.parse(storedProjects);
        setPreferredProjects(parsedProjects);
      } catch (error) {
        console.error("Error parsing preferred projects from localStorage:", error);
        setPreferredProjects([]);
      }
    } else {
      setPreferredProjects([]);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
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

      {/* Body Content */}
      <div className="flex pt-20">
        {/* Sidebar */}
        <aside className="w-64 bg-blue-900 text-white min-h-screen p-4">
          <h2 className="text-2xl font-bold mb-6">Student Dashboard</h2>
          <nav className="flex flex-col space-y-3">
            <Button variant="ghost" onClick={() => navigate("/student/dashboard")} className="justify-start text-left text-white">Dashboard</Button>
            <Button variant="ghost" onClick={() => navigate("/student/view-projects")} className="justify-start text-left text-white">View Projects</Button>
            <Button variant="ghost" onClick={() => navigate("/student/provide-preferences")} className="justify-start text-left text-white">Provide Preferences</Button>
            <Button variant="ghost" onClick={() => navigate("/student/assigned-projects")} className="justify-start text-left text-white">View Assigned Projects</Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Preferred Projects</h1>
          {preferredProjects.length > 0 ? (
            <div className="space-y-6">
              {preferredProjects.map((project) => (
                <Card key={project.id} className="w-full shadow-lg bg-white transition-transform duration-200">
                  <CardHeader>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <CardDescription>Client: {project.client}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3 text-gray-700">{project.description}</p>
                    <p className="font-semibold">Skills Required:</p>
                    <ul className="list-disc list-inside text-gray-700">
                      {project.skills.map((skill, i) => (
                        <li key={i}>{skill}</li>
                      ))}
                    </ul>
                    <p className="mt-3 font-semibold">Resources:</p>
                    <ul className="list-disc list-inside text-gray-700">
                      {project.resources.map((res, i) => (
                        <li key={i}>{res}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">You haven't added any preferred projects yet.</p>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-green-800 text-white text-sm py-4 text-center mt-auto">
        © 2025 Capstone Portal. All rights reserved. | Contact us:{" "}
        <a href="mailto:support@capstoneportal.com" className="text-blue-300 underline">support@capstoneportal.com</a>{" "}
        | Phone: 123-456-7890
      </footer>
    </div>
  );
};

export default ProvidePreferences;
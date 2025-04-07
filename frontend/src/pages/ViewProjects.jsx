import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ViewProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const sampleProjects = [
      {
        id: 1,
        title: "AI Research",
        client: "Tech Innovations Ltd.",
        description: "Developing AI models for predictive analytics.",
        skills: ["Machine Learning", "Python", "Data Analysis"],
        resources: ["Project Guidelines", "Dataset A", "Reference Paper"],
      },
      {
        id: 2,
        title: "Smart Agriculture",
        client: "AgroTech Co.",
        description: "IoT and ML for efficient crop monitoring.",
        skills: ["IoT", "Python", "Sensors"],
        resources: ["Field Blueprint", "Sensor Docs"],
      },
      {
        id: 3,
        title: "Quantum Computing",
        client: "Google",
        description: "Sample",
        skills: ["Physics", "Python", "Java"],
        resources: ["Field", "Sensor Docs", "Wikipidea"],
      },
    ];
    setProjects(sampleProjects);
  }, []);

  const handleAddPreference = (project) => {
    const existing = JSON.parse(localStorage.getItem("preferredProjects")) || [];
    const alreadyExists = existing.find((p) => p.id === project.id);
    if (!alreadyExists) {
      localStorage.setItem("preferredProjects", JSON.stringify([...existing, project]));
    }
  };

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

      {/* Content */}
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

        {/* Main Section */}
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Explore Projects</h1>

          <div className="space-y-6">
            {projects.map((project) => (
              <div
                key={project.id}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative"
              >
                <Card className="w-full shadow-lg bg-white transition duration-200">
                  {hoveredId === project.id && (
                    <div className="absolute top-4 right-4 z-10">
                      <Button
                        size="sm"
                        className="bg-white text-black border border-black hover:bg-gray-200"
                        onClick={() => handleAddPreference(project)}
                      >
                        Add Preference
                      </Button>
                    </div>
                  )}
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
              </div>
            ))}
          </div>
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

export default ViewProjects;
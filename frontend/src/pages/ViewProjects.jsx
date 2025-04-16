// ✅ Refactored ViewProjects.jsx for improved user interaction and fluid layout
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
        resources: ["Field", "Sensor Docs", "Wikipedia"],
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
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-blue-900 text-white min-h-screen p-4">
        <h2 className="text-2xl font-bold mb-6">Student Dashboard</h2>
        <nav className="flex flex-col space-y-3">
          <Button variant="ghost" onClick={() => navigate("/student/dashboard")} className="justify-start text-left text-white">Dashboard</Button>
          <Button variant="ghost" onClick={() => navigate("/student/view-projects")} className="justify-start text-left text-white">View Projects</Button>
          <Button variant="ghost" onClick={() => navigate("/student/provide-preferences")} className="justify-start text-left text-white">Provide Preferences</Button>
          <Button variant="ghost" onClick={() => navigate("/student/assigned-projects")} className="justify-start text-left text-white">View Assigned Projects</Button>
        </nav>
      </aside>

      <main className="flex-1 p-10 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h1 className="text-4xl font-bold mb-8 text-gray-800">Explore Projects</h1>

          <div className="space-y-6">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative"
              >
                <Card className="w-full shadow-lg bg-white rounded-xl transition duration-200">
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
                    <CardTitle className="text-xl text-blue-700">{project.title}</CardTitle>
                    <CardDescription className="text-gray-600">Client: {project.client}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">{project.description}</p>
                    <div>
                      <p className="font-semibold">Skills Required:</p>
                      <ul className="list-disc list-inside text-gray-700">
                        {project.skills.map((skill, i) => <li key={i}>{skill}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold">Resources:</p>
                      <ul className="list-disc list-inside text-gray-700">
                        {project.resources.map((res, i) => <li key={i}>{res}</li>)}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ViewProjects;

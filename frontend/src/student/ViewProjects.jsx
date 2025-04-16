import React, { useState, useEffect } from "react";
import TopbarWithSidebar from "../pages/TopbarWithSidebar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const ViewProjects = () => {
  const [projects, setProjects] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:5006/api/projects"); // ✅ updated port
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      }
    };

    fetchProjects();
  }, []);

  const handleAddPreference = async (projectId) => {
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5006/api/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ project_id: projectId }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Error adding preference");

      setMessage(result.message);
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <TopbarWithSidebar>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Explore Projects</h1>

        {error && <p className="text-red-500 font-medium mb-4">{error}</p>}
        {message && <p className="text-green-600 font-medium mb-4">{message}</p>}

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
                      onClick={() => handleAddPreference(project.id)}
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

                  {project.skills_required && (
                    <div>
                      <p className="font-semibold">Skills Required:</p>
                      <ul className="list-disc list-inside text-gray-700">
                        {project.skills_required.split(",").map((skill, i) => (
                          <li key={i}>{skill.trim()}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {project.resources && (
                    <div>
                      <p className="font-semibold">Resources:</p>
                      <ul className="list-disc list-inside text-gray-700">
                        {project.resources.split(",").map((res, i) => (
                          <li key={i}>{res.trim()}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </TopbarWithSidebar>
  );
};

export default ViewProjects;

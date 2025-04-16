// ✅ Refactored ProvidePreferences.jsx with polished layout and interactivity
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ProvidePreferences = () => {
  const navigate = useNavigate();
  const [preferredProjects, setPreferredProjects] = useState([]);

  useEffect(() => {
    const storedProjects = localStorage.getItem("preferredProjects");
    if (storedProjects) {
      try {
        setPreferredProjects(JSON.parse(storedProjects));
      } catch (error) {
        console.error("Error parsing preferred projects:", error);
        setPreferredProjects([]);
      }
    }
  }, []);

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
          <h1 className="text-4xl font-bold mb-8 text-gray-800">Your Preferred Projects</h1>

          {preferredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {preferredProjects.map((project) => (
                <Card key={project.id} className="shadow-md bg-white rounded-xl">
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
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <img src="/no-preferences.svg" alt="No Preferences" className="h-40 mx-auto mb-6" />
              <p className="text-gray-600 text-lg">You haven't added any preferred projects yet.</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default ProvidePreferences;

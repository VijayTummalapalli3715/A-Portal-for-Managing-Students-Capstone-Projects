import React, { useEffect, useState } from "react";
import TopbarWithSidebar from "../pages/TopbarWithSidebar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";

const ProvidePreferences = () => {
  const [preferredProjects, setPreferredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5006/api/preferences/student", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message || "Failed to fetch preferences");
        }

        const data = await res.json();
        setPreferredProjects(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  return (
    <TopbarWithSidebar>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Your Preferred Projects</h1>

        {loading && <p className="text-gray-600">Loading preferences...</p>}
        {error && <p className="text-red-500 font-medium">{error}</p>}

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
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-20">
              <img src="/no-preferences.svg" alt="No Preferences" className="h-40 mx-auto mb-6" />
              <p className="text-gray-600 text-lg">You haven't added any preferred projects yet.</p>
            </div>
          )
        )}
      </motion.div>
    </TopbarWithSidebar>
  );
};

export default ProvidePreferences;
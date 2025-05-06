import React, { useEffect, useState } from "react";
import TopbarWithSidebar from "../pages/TopbarWithSidebar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";

const AssignedProjects = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignedProject = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5006/api/student/assigned-project", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const data = await res.json();
          
          setError(data.message || "No assigned project found");
          setProject(null);
        } else {
          const data = await res.json();
          const project = data?.project;
          const group = data?.group;
          setProject(project);
          console.log("data", data);
          console.log("project", project);
          console.log('DEBUG: Setting assigned project data:', data);
        }
      } catch (err) {
        setError("Failed to fetch assigned project");
        setProject(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignedProject();
  }, []);

  return (
    <TopbarWithSidebar>
      <div className="flex flex-col min-h-screen">
        <motion.div
          className="flex-grow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-4xl font-bold mb-8 text-gray-800">Assigned Project Details</h1>

          {loading ? (
            <p className="text-gray-600">Loading assigned project...</p>
          ) : error ? (
            <Card className="mb-8 shadow-md rounded-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-700">No Assigned Project</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{error.includes("No assigned project") ? "Your instructor is assigning projects or you have not yet been assigned. If you haven't provided your preferences, please do so." : error}</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="mb-8 shadow-md rounded-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-700">{project.title}</CardTitle>
                  {project.client && <CardDescription>Client: {project.client}</CardDescription>}
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{project.description}</p>
                  {project.skills && (
                    <div>
                      <p className="font-semibold">Skills Required:</p>
                      <ul className="list-disc list-inside text-gray-700">
                        {project.skills.split ? project.skills.split(",").map((skill, index) => (
                          <li key={index}>{skill.trim()}</li>
                        )) : null}
                      </ul>
                    </div>
                  )}
                  {project.resources && (
                    <div>
                      <p className="font-semibold">Resources:</p>
                      <ul className="list-disc list-inside text-gray-700">
                        {project.resources.split ? project.resources.split(",").map((res, index) => (
                          <li key={index}>{res.trim()}</li>
                        )) : null}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Team Members */}
              {project.teamMembers && project.teamMembers.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Team Members</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.teamMembers.map((member) => (
                      <Card key={member.id} className="p-4 shadow-md rounded-xl">
                        <CardHeader>
                          <CardTitle className="text-xl text-gray-800">{member.name}</CardTitle>
                          {member.role && <CardDescription>{member.role}</CardDescription>}
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700">Email: {member.email}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </motion.div>
      </div>
    </TopbarWithSidebar>
  );
};

export default AssignedProjects;

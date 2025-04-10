import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import Sidebar from "@/components/ui/sidebar";
import { Eye, Pencil, FolderOpen } from "lucide-react";
import { motion } from "framer-motion";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5006/api/projects/client", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        console.log("Fetched projects:", data); // Debugging
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  // Adjust this logic based on your actual field (status or is_approved)
  const approved = projects.filter((p) => p.is_approved === true);
  const rejected = projects.filter((p) => p.is_approved === false);
  const pending = projects.filter((p) => p.is_approved !== true && p.is_approved !== false);

  const renderSection = (title, list) => (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">{title}</h2>
      {list.length === 0 ? (
        <p className="text-muted-foreground pl-1">No {title.toLowerCase()}.</p>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((project, i) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="rounded-2xl shadow-md hover:shadow-xl transition">
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.main_category}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-gray-600">{project.description}</p>
                  <div className="flex gap-3 pt-2">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/edit-project/${project.id}`)}>
                      <Pencil className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => navigate(`/project/${project.id}/proposals`)}>
                      <Eye className="w-4 h-4 mr-1" /> View Proposals
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 max-w-screen-xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">My Projects</h1>
          <Button onClick={() => navigate("/create-project")} className="bg-blue-600 text-white">
            + Create Project
          </Button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center text-muted-foreground p-6 border rounded-xl">
            <FolderOpen className="mx-auto h-8 w-8 mb-2" />
            <p>You have no projects yet. Create your first project!</p>
          </div>
        ) : (
          <>
            {renderSection("Approved Projects", approved)}
            {renderSection("Rejected Projects", rejected)}
            {renderSection("Pending Projects", pending)}
          </>
        )}
      </main>
    </div>
  );
};

export default Projects;

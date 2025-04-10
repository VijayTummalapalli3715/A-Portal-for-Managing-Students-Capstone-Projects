import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Sidebar from "@/components/ui/sidebar";
import { Eye, Pencil } from "lucide-react";

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
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const approved = projects.filter((p) => p.is_approved === true);
  const rejected = projects.filter((p) => p.is_approved === false);
  const pending = projects.filter((p) => p.is_approved !== true && p.is_approved !== false);

  const renderCards = (list) => (
    <div className="space-y-4">
      {list.map((project) => (
        <Card key={project.id} className="w-full shadow-sm border border-gray-300">
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <p className="text-sm text-gray-500">{project.main_category}</p>
              </div>
              <span className="text-xs font-medium text-gray-500">
                {project.is_approved === true ? "Approved" : project.is_approved === false ? "Rejected" : "Pending"}
              </span>
            </div>
            <p className="text-sm text-gray-700">{project.description}</p>
            <div className="flex justify-end gap-3 pt-3">
              <Button variant="outline" size="sm" onClick={() => navigate(`/edit-project/${project.id}`)}>
                <Pencil className="w-4 h-4 mr-1" /> Edit
              </Button>
              <Button variant="secondary" size="sm" onClick={() => navigate(`/project/${project.id}/proposals`)}>
                <Eye className="w-4 h-4 mr-1" /> View Proposals
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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

      {/* Body */}
      <div className="flex pt-24">
        <Sidebar />
        <main className="flex-1 !pt-10 py-8 max-w-screen-xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-blue-800">📁 My Projects</h1>
              <p className="text-sm text-gray-500">Manage your proposals and track progress</p>
            </div>
            <Button onClick={() => navigate("/create-project")} className="bg-blue-600 text-white hover:bg-blue-700">
              + Create Project
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Approved */}
            <div className="bg-green-50 border border-green-300 rounded-xl p-4 h-[500px] overflow-y-auto shadow-sm">
              <h2 className="text-xl font-semibold text-green-800 mb-4">✅ Approved Projects</h2>
              {approved.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No approved projects.</p>
              ) : (
                renderCards(approved)
              )}
            </div>

            {/* Rejected */}
            <div className="bg-red-50 border border-red-300 rounded-xl p-4 h-[500px] overflow-y-auto shadow-sm">
              <h2 className="text-xl font-semibold text-red-800 mb-4">❌ Rejected Projects</h2>
              {rejected.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No rejected projects.</p>
              ) : (
                renderCards(rejected)
              )}
            </div>

            {/* Pending */}
            <div className="bg-white border border-gray-300 rounded-xl p-4 h-[500px] overflow-y-auto shadow-sm">
              <h2 className="text-xl font-semibold text-yellow-600 mb-4">⏳ Pending Projects</h2>
              {pending.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No pending projects.</p>
              ) : (
                renderCards(pending)
              )}
            </div>
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

export default Projects;
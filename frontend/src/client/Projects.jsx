// ✅ Refactored Projects.jsx with improved layout, spacing, and status badges
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Pencil } from "lucide-react";
import TopbarWithSidebar from "@/pages/TopbarWithSidebar";

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

  const StatusBadge = ({ status }) => {
    const colors = {
      Approved: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
      Pending: "bg-yellow-100 text-yellow-700",
    };
    return (
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors[status]}`}>{status}</span>
    );
  };

  const renderCards = (list) => (
    <div className="space-y-4">
      {list.map((project) => (
        <Card
          key={project.id}
          className="w-full rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition duration-300"
        >
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
                <p className="text-sm text-gray-500">{project.main_category}</p>
              </div>
              <StatusBadge
                status={
                  project.is_approved === true
                    ? "Approved"
                    : project.is_approved === false
                    ? "Rejected"
                    : "Pending"
                }
              />
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
    <TopbarWithSidebar>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-blue-800">📁 My Projects</h1>
          <p className="text-sm text-gray-500">Manage your proposals and track progress</p>
        </div>
        <Button
          onClick={() => navigate("/create-project")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md"
        >
          + Create Project
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Approved */}
        <section className="bg-green-50 border border-green-300 rounded-xl p-4 max-h-[550px] overflow-y-auto">
          <h2 className="text-xl font-semibold text-green-800 mb-4">✅ Approved Projects</h2>
          {approved.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No approved projects.</p>
          ) : (
            renderCards(approved)
          )}
        </section>

        {/* Rejected */}
        <section className="bg-red-50 border border-red-300 rounded-xl p-4 max-h-[550px] overflow-y-auto">
          <h2 className="text-xl font-semibold text-red-800 mb-4">❌ Rejected Projects</h2>
          {rejected.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No rejected projects.</p>
          ) : (
            renderCards(rejected)
          )}
        </section>

        {/* Pending */}
        <section className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 max-h-[550px] overflow-y-auto">
          <h2 className="text-xl font-semibold text-yellow-800 mb-4">⏳ Pending Projects</h2>
          {pending.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No pending projects.</p>
          ) : (
            renderCards(pending)
          )}
        </section>
      </div>
    </TopbarWithSidebar>
  );
};

export default Projects;

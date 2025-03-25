import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import Sidebar from "@/components/ui/sidebar"; 
import { fetchClientDashboardData, fetchRecommendedProjects } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig"; // adjust path if needed


const ClientDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data } = await fetchClientDashboardData();
        setDashboardData(data);
      } catch (err) {
        console.error("Dashboard fetch failed", err);
      }
    };

    const loadRecommended = async () => {
      try {
        const { data } = await fetchRecommendedProjects();
        setRecommended(data);
      } catch (err) {
        console.error("Recommendations fetch failed", err);
      }
    };

    loadDashboard();
    loadRecommended();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("uid");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (!dashboardData) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Client Dashboard</h1>
          <Button variant="outline" onClick={handleLogout} className="border-gray-400">Logout</Button>
        </div>

        {/* Tasks + Events */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.tasks?.map((task, i) => (
                <div key={i} className="mb-4">
                  <span className="text-sm text-red-500 font-semibold">{task.label}</span>
                  <p className="mt-2 text-gray-700">{task.description}</p>
                  <Button className="mt-2">{task.buttonText}</Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.events.length === 0 ? (
                <p className="text-gray-500">You have no upcoming events.</p>
              ) : (
                dashboardData.events.map((event, i) => (
                  <p key={i}>{event.name} - {event.date}</p>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* My Projects */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">My Projects</h2>
            <Button onClick={() => navigate("/create-project")} className="bg-blue-600 hover:bg-blue-700 text-white">+ Create Project</Button>
          </div>
          {dashboardData.projects.length === 0 ? (
            <Card className="p-6 text-center text-gray-500 shadow-sm">
              <p>You have no projects yet.</p>
              <Button className="mt-3">Create Project</Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dashboardData.projects.map((project, i) => (
                <Card key={i} className="shadow-md">
                  <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>{project.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{project.description}</p>
                    <Button variant="outline" className="mt-2">Edit</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recommended */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Recommended Experiences</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(recommended || []).map((rec, i) => (
              <Card key={i} className="p-4 shadow-md">
                <CardHeader>
                  <CardTitle>{rec.institution}</CardTitle>
                  <CardDescription>{rec.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{rec.title}</p>
                  <Button variant="outline" className="mt-3">View Details</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};


export default ClientDashboard;


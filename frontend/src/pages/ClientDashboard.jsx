import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import Sidebar from "@/components/ui/sidebar";
import { fetchClientDashboardData, fetchRecommendedProjects } from "@/lib/api";
import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig";

const ClientDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const loadDashboardData = async () => {
    try {
      const data = await fetchClientDashboardData();
      if (data && typeof data === "object") {
        setDashboardData(data);
      } else {
        console.warn("Unexpected dashboard data format:", data);
      }
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
      setDashboardData({ events: [], tasks: [], projects: [] });
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        console.warn("Auth state changed: No user found");
        setDashboardData({ events: [], tasks: [], projects: [] });
        return;
      }

      try {
        const token = await user.getIdToken(true);
        console.log("User is authenticated. Token:", token);
        await loadDashboardData();
      } catch (err) {
        console.error("Error fetching token:", err);
      }
    });

    const loadRecommended = async () => {
      try {
        const { data } = await fetchRecommendedProjects();
        setRecommended(data);
      } catch (err) {
        console.error("Recommendations fetch failed", err);
      }
    };

    loadRecommended();

    // Also check location state to refresh after project creation
    if (location.state?.projectCreated) {
      loadDashboardData();
    }

    return () => unsubscribe();
  }, [location.state?.projectCreated]);

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

  if (!dashboardData) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  const events = Array.isArray(dashboardData?.events) ? dashboardData.events : [];
  const tasks = Array.isArray(dashboardData?.tasks) ? dashboardData.tasks : [];
  const projects = Array.isArray(dashboardData?.projects) ? dashboardData.projects : [];

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
              {tasks.length === 0 ? (
                <p className="text-gray-500">No tasks available.</p>
              ) : (
                tasks.map((task, i) => (
                  <div key={i} className="mb-4">
                    <span className="text-sm text-red-500 font-semibold">{task.label}</span>
                    <p className="mt-2 text-gray-700">{task.description}</p>
                    <Button className="mt-2">{task.buttonText}</Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <p className="text-gray-500">You have no upcoming events.</p>
              ) : (
                events.map((event, i) => (
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
            <Button onClick={() => navigate("/create-project", { state: { fromDashboard: true } })} className="bg-blue-600 hover:bg-blue-700 text-white">+ Create Project</Button>
          </div>
          {projects.length === 0 ? (
            <Card className="p-6 text-center text-gray-500 shadow-sm">
              <p>You have no projects yet.</p>
              <Button className="mt-3" onClick={() => navigate("/create-project")}>Create Project</Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project, i) => (
                <Card key={i} className="shadow-md">
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>{project.main_category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2">{project.description}</p>
                    <div className="flex gap-3 mt-2">
                      <Button variant="outline">Edit</Button>
                      <Button variant="destructive">Delete</Button>
                      <Button variant="secondary">View Proposals</Button>
                    </div>
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

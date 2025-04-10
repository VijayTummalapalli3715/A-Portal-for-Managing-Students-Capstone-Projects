import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import Sidebar from "@/components/ui/sidebar";
import { fetchClientDashboardData, fetchRecommendedProjects } from "@/lib/api";
import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const ClientDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const loadDashboardData = async () => {
    try {
      const data = await fetchClientDashboardData();
      setDashboardData(data);
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
      setDashboardData({ events: [], tasks: [], projects: [] });
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setDashboardData({ events: [], tasks: [], projects: [] });
        return;
      }
      await loadDashboardData();
    });

    fetchRecommendedProjects().then(({ data }) => setRecommended(data)).catch(console.error);

    if (location.state?.projectCreated) {
      loadDashboardData();
    }

    return () => unsubscribe();
  }, [location.state?.projectCreated]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      toast.success("You have been signed out successfully.");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed");
    }
  };

  if (!dashboardData) return <div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>;

  const { events = [], tasks = [] } = dashboardData;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-green-800 text-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Capstone Project Management Portal</h1>
          <nav className="flex gap-6 text-sm font-semibold">
            <Button variant="ghost" onClick={() => navigate("/home")} className="text-white">Home</Button>
            <Button variant="ghost" onClick={() => navigate("/login")} className="text-white">Login</Button>
            <Button variant="ghost" onClick={() => navigate("/about")} className="text-white">About</Button>
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
      <div className="flex flex-1 pt-20">
        <Sidebar />
        <main className="flex-1 !pt-10 p-6 max-w-screen-xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800">Client Dashboard</h1>
            <Button variant="ghost" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>

          {/* Tasks & Events */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="rounded-2xl shadow-lg">
                <CardHeader><CardTitle>Tasks</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {tasks.length === 0 ? (
                    <p className="text-muted-foreground">No tasks available.</p>
                  ) : (
                    tasks.map((task, i) => (
                      <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                        <h4 className="text-sm font-medium text-red-500">{task.label}</h4>
                        <p className="text-gray-700 mt-1 mb-2">{task.description}</p>
                        <Button size="sm" variant="secondary">{task.buttonText}</Button>
                      </motion.div>
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="rounded-2xl shadow-lg">
                <CardHeader><CardTitle>Upcoming Events</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {events.length === 0 ? (
                    <p className="text-muted-foreground">You have no upcoming events.</p>
                  ) : (
                    events.map((event, i) => (
                      <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                        <p className="text-gray-800 font-medium">{event.name}</p>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                      </motion.div>
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recommended */}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Recommended Experiences</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(recommended || []).map((rec, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="p-4 rounded-xl shadow-md hover:shadow-lg transition">
                    <CardHeader>
                      <CardTitle className="text-lg">{rec.institution}</CardTitle>
                      <CardDescription>{rec.location}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{rec.title}</p>
                      <Button variant="outline" size="sm" className="mt-3">View Details</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-green-800 text-white text-sm py-4 text-center">
        © 2025 Capstone Portal. All rights reserved. | Contact us:{" "}
        <a href="mailto:support@capstoneportal.com" className="text-blue-300 underline">support@capstoneportal.com</a>{" "}
        | Phone: 123-456-7890
      </footer>
    </div>
  );
};

export default ClientDashboard;

import React from "react";
import TopbarWithSidebar from "../pages/TopbarWithSidebar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <TopbarWithSidebar>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Welcome to Your Student Dashboard</h1>

        {/* Quick Task Card */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Upcoming Task</CardTitle>
              <CardDescription>Project Preference Submission</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">Don’t forget to submit your top 3 project preferences before the deadline.</p>
              <button
                onClick={() => navigate("/student/view-projects")}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              >
                View Projects
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Summary Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-4 shadow">
            <CardHeader>
              <CardTitle className="text-xl">Preferences</CardTitle>
              <CardDescription>Projects you've selected</CardDescription>
            </CardHeader>
            <CardContent>
              <button
                onClick={() => navigate("/student/provide-preferences")}
                className="text-blue-600 hover:underline text-sm"
              >
                View Preferences
              </button>
            </CardContent>
          </Card>

          <Card className="p-4 shadow">
            <CardHeader>
              <CardTitle className="text-xl">Assigned Project</CardTitle>
              <CardDescription>See your allocated capstone</CardDescription>
            </CardHeader>
            <CardContent>
              <button
                onClick={() => navigate("/student/assigned-projects")}
                className="text-blue-600 hover:underline text-sm"
              >
                View Assigned Project
              </button>
            </CardContent>
          </Card>

          <Card className="p-4 shadow">
            <CardHeader>
              <CardTitle className="text-xl">Explore</CardTitle>
              <CardDescription>Check available projects</CardDescription>
            </CardHeader>
            <CardContent>
              <button
                onClick={() => navigate("/student/view-projects")}
                className="text-blue-600 hover:underline text-sm"
              >
                Browse Projects
              </button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </TopbarWithSidebar>
  );
};

export default StudentDashboard;

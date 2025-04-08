import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
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

      {/* Body Content */}
      <div className="flex pt-20">
        {/* Sidebar */}
        <aside className="w-64 bg-blue-900 text-white min-h-screen p-4">
          <h2 className="text-2xl font-bold mb-6">Student Dashboard</h2>
          <nav className="flex flex-col space-y-3">
            <Button variant="ghost" className="justify-start text-left text-white">Dashboard</Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/student/view-projects")}
              className="justify-start text-left text-white"
            >
              View Projects
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/student/provide-preferences")}
              className="justify-start text-left text-white"
            >
              Provide Preferences
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/student/assigned-projects")}
              className="justify-start text-left text-white"
            >
              View Assigned Projects
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Tasks Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold mb-4">Tasks</h1>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-md">
                  <span className="text-sm text-blue-500 font-semibold">Pending</span>
                  <p className="text-gray-600 mt-2">Submit project preferences before the deadline.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Assigned Projects Section */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Assigned Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-4">
                <CardHeader>
                  <CardTitle>AI Research</CardTitle>
                  <CardDescription>Instructor: Dr. Smith</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Status: Ongoing</p>
                  <Button variant="outline" className="mt-3">View Details</Button>
                </CardContent>
              </Card>

              <Card className="p-4">
                <CardHeader>
                  <CardTitle>Quantum Computing</CardTitle>
                  <CardDescription>Instructor: Prof. Johnson</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Status: Pending Review</p>
                  <Button variant="outline" className="mt-3">View Details</Button>
                </CardContent>
              </Card>

              <Card className="p-4">
                <CardHeader>
                  <CardTitle>Smart Grid AI</CardTitle>
                  <CardDescription>Instructor: Dr. Allen</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Status: Completed</p>
                  <Button variant="outline" className="mt-3">View Report</Button>
                </CardContent>
              </Card>
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

export default StudentDashboard;

import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const InstructorDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 bg-blue-900 text-white min-h-screen p-6">
        <h2 className="text-2xl font-bold mb-6">Instructor Dashboard</h2>
        <nav className="flex flex-col space-y-3">
          <Button variant="ghost" className="justify-start text-left">
            Add Class
          </Button>
          <Button variant="ghost" className="justify-start text-left">
            Add Projects
          </Button>
          <Button variant="ghost" className="justify-start text-left">
            Add Students
          </Button>
          <Button variant="ghost" className="justify-start text-left">
            Setup Groups
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <Button variant="default">+ Add Class</Button>
        </div>

        {/* Tasks Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-md">
                <span className="text-sm text-red-500 font-semibold">Pending</span>
                <p className="text-gray-600 mt-2">Add students and assign projects.</p>
                <Button variant="outline" className="mt-3">
                  Manage Students
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">No upcoming deadlines.</p>
            </CardContent>
          </Card>
        </div>

        {/* Student Groups Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Student Groups</h2>
          <Card className="p-6 text-center text-gray-500">
            <p>No groups created yet.</p>
            <Button variant="default" className="mt-3">
              Setup Groups
            </Button>
          </Card>
        </div>

        {/* Assigned Projects Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Assigned Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-4">
              <CardHeader>
                <CardTitle>Client A Project</CardTitle>
                <CardDescription>Deadline: April 5, 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Manage and track progress.</p>
                <Button variant="outline" className="mt-3">
                  View Details
                </Button>
              </CardContent>
            </Card>

            <Card className="p-4">
              <CardHeader>
                <CardTitle>Quantum Research</CardTitle>
                <CardDescription>Deadline: April 12, 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Assigned to Group B.</p>
                <Button variant="outline" className="mt-3">
                  View Details
                </Button>
              </CardContent>
            </Card>

            <Card className="p-4">
              <CardHeader>
                <CardTitle>AI Model Training</CardTitle>
                <CardDescription>Deadline: May 1, 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Pending approval.</p>
                <Button variant="outline" className="mt-3">
                  View Details
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstructorDashboard;

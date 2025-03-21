import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const StudentDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 bg-blue-900 text-white min-h-screen p-6">
        <h2 className="text-2xl font-bold mb-6">Student Dashboard</h2>
        <nav className="flex flex-col space-y-3">
          <Button variant="ghost" className="justify-start text-left">
            View Projects
          </Button>
          <Button variant="ghost" className="justify-start text-left">
            Provide Preferences
          </Button>
          <Button variant="ghost" className="justify-start text-left">
            View Assigned Projects
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <Button variant="default">Submit Preferences</Button>
        </div>

        {/* Tasks Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-md">
                <span className="text-sm text-blue-500 font-semibold">Pending</span>
                <p className="text-gray-600 mt-2">Submit project preferences before the deadline.</p>
                <Button variant="outline" className="mt-3">
                  Submit Preferences
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

        {/* Assigned Projects Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Assigned Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-4">
              <CardHeader>
                <CardTitle>AI Research</CardTitle>
                <CardDescription>Instructor: Dr. Smith</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Status: Ongoing</p>
                <Button variant="outline" className="mt-3">
                  View Details
                </Button>
              </CardContent>
            </Card>

            <Card className="p-4">
              <CardHeader>
                <CardTitle>Quantum Computing</CardTitle>
                <CardDescription>Instructor: Prof. Johnson</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Status: Pending Review</p>
                <Button variant="outline" className="mt-3">
                  View Details
                </Button>
              </CardContent>
            </Card>

            <Card className="p-4">
              <CardHeader>
                <CardTitle>Smart Grid AI</CardTitle>
                <CardDescription>Instructor: Dr. Allen</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Status: Completed</p>
                <Button variant="outline" className="mt-3">
                  View Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;

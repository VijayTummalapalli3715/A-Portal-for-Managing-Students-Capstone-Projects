import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ClientDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 bg-blue-900 text-white min-h-screen p-6">
        <h2 className="text-2xl font-bold mb-6">Client Dashboard</h2>
        <nav className="flex flex-col space-y-3">
          <Button variant="ghost" className="justify-start text-left">
            Create Projects
          </Button>
          <Button variant="ghost" className="justify-start text-left">
            View Student Groups
          </Button>
          <Button variant="ghost" className="justify-start text-left">
            Approve/Reject Projects
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <Button variant="default">+ Create Project</Button>
        </div>

        {/* Tasks Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-md">
                <span className="text-sm text-red-500 font-semibold">Required</span>
                <p className="text-gray-600 mt-2">Create a project to get started.</p>
                <Button variant="outline" className="mt-3">
                  Create Project
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">You have no upcoming events.</p>
            </CardContent>
          </Card>
        </div>

        {/* Projects Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">My Projects</h2>
          <Card className="p-6 text-center text-gray-500">
            <p>You have no projects yet.</p>
            <Button variant="default" className="mt-3">
              Create Project
            </Button>
          </Card>
        </div>

        {/* Recommended Projects */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recommended Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-4">
              <CardHeader>
                <CardTitle>College of Wooster</CardTitle>
                <CardDescription>Wooster, Ohio, United States</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Indigenous Histories, Power, and Social Justice</p>
                <Button variant="outline" className="mt-3">
                  View Details
                </Button>
              </CardContent>
            </Card>

            <Card className="p-4">
              <CardHeader>
                <CardTitle>UNC Charlotte</CardTitle>
                <CardDescription>Charlotte, North Carolina, USA</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Business & Strategy Focus</p>
                <Button variant="outline" className="mt-3">
                  View Details
                </Button>
              </CardContent>
            </Card>

            <Card className="p-4">
              <CardHeader>
                <CardTitle>University of California, Merced</CardTitle>
                <CardDescription>Merced, CA, USA</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Quantum Applications</p>
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

export default ClientDashboard;

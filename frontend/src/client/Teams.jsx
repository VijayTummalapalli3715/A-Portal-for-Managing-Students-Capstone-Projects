// src/pages/Teams.jsx
import React from "react";
import Sidebar from "@/components/ui/sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

const Teams = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 max-w-screen-xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Teams</h1>

        <Card className="rounded-xl shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-muted-foreground" /> Team Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You are not part of any teams yet. Once you join a project or collaborate, your team details will appear here.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Teams;
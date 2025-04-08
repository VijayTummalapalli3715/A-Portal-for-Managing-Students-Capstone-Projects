// src/pages/Achievements.jsx
import React from "react";
import Sidebar from "@/components/ui/sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

const Achievements = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 max-w-screen-xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Achievements</h1>

        <Card className="rounded-xl shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" /> Accomplishments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No achievements unlocked yet. As you complete projects or milestones, they’ll appear here.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Achievements;

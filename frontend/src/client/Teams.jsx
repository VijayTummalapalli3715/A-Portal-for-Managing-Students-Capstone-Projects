// ✅ Refactored Teams.jsx with enhanced layout and interaction
import React from "react";
import Sidebar from "@/components/ui/sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { motion } from "framer-motion";

const Teams = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8 max-w-7xl mx-auto overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Teams</h1>

          <Card className="rounded-2xl shadow-lg border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-blue-700">
                <User className="w-5 h-5 text-muted-foreground" /> Team Assignments
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center py-8">
              <img src="/no-teams.svg" className="h-40 mb-4" alt="No Teams" />
              <p className="text-gray-600 max-w-md">
                You are not part of any teams yet. Join a project or collaborate to see your team details here.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Teams;

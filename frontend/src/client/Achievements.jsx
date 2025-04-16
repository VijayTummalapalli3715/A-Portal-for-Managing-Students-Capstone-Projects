// ✅ Refactored Achievements.jsx with better visuals and empty state UX
import React from "react";
import Sidebar from "@/components/ui/sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";

const Achievements = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Achievements</h1>

          <Card className="rounded-2xl shadow-md border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-yellow-600">
                <Trophy className="w-5 h-5 text-yellow-500" /> Accomplishments
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center py-10">
              <img
                src="/no-achievements.svg"
                alt="No achievements"
                className="h-40 mb-4"
              />
              <p className="text-gray-600 max-w-md">
                No achievements unlocked yet. As you complete projects or reach milestones, your accomplishments will be displayed here.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Achievements;

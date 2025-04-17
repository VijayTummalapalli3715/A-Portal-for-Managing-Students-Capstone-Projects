// ✅ Refactored Bookmarks.jsx with better positioning and visuals
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import TopbarWithSidebar from "@/pages/TopbarWithSidebar";

const Bookmarks = () => {
  return (
    <TopbarWithSidebar>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Bookmarks</h1>

        <Card className="rounded-2xl shadow-md border border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-blue-600">
              <Bookmark className="w-5 h-5 text-blue-500" /> Saved Projects
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center py-10">
            <img
              src="/no-bookmarks.svg"
              alt="No bookmarks"
              className="h-40 mb-4"
            />
            <p className="text-gray-600 max-w-md">
              You haven't bookmarked any projects yet. When you do, they'll be listed here for easy access.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </TopbarWithSidebar>
  );
};

export default Bookmarks;

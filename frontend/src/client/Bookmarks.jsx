// src/pages/Bookmarks.jsx
import React from "react";
import Sidebar from "@/components/ui/sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bookmark } from "lucide-react";

const Bookmarks = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 max-w-screen-xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Bookmarks</h1>

        <Card className="rounded-xl shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-blue-600" /> Saved Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You haven’t bookmarked any projects yet. When you do, they’ll be listed here for easy access.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Bookmarks;

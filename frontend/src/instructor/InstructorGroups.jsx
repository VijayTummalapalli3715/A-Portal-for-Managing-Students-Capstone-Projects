import React, { useState, useEffect } from "react";
import TopbarWithSidebar from "@/pages/TopbarWithSidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const InstructorGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5006/api/groups", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error("Failed to fetch groups");
      
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      toast.error("Failed to load groups");
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateGroups = async () => {
    try {
      setGenerating(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5006/api/groups/generate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to generate groups");
      }

      toast.success("Groups generated successfully!");
      await fetchGroups(); // Refresh the groups list
    } catch (error) {
      toast.error(error.message || "Failed to generate groups");
      console.error("Error generating groups:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleModifyGroup = async (groupId, studentId, action) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5006/api/groups/${groupId}/${action}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to ${action} student`);
      }

      toast.success(`Student ${action}ed successfully!`);
      await fetchGroups(); // Refresh the groups list
    } catch (error) {
      toast.error(error.message || `Failed to ${action} student`);
      console.error(`Error ${action}ing student:`, error);
    }
  };

  return (
    <TopbarWithSidebar>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Student Groups</h1>
          <div className="flex gap-3">
            <Button
              onClick={handleGenerateGroups}
              disabled={generating}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${generating ? "animate-spin" : ""}`} />
              {generating ? "Generating..." : "Generate Groups"}
            </Button>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : groups.length > 0 ? (
            groups.map((group) => (
              <Card key={group.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">
                    Group {group.id}
                  </CardTitle>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {group.project && (
                      <div>
                        <h4 className="font-medium text-gray-700">Assigned Project</h4>
                        <p className="text-sm text-gray-600">{group.project.title}</p>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Members</h4>
                      <ul className="space-y-2">
                        {group.members.map((member) => (
                          <li
                            key={member.id}
                            className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                          >
                            <span className="text-sm">{member.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleModifyGroup(group.id, member.id, "remove")}
                            >
                              Remove
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No Groups Yet</h3>
              <p className="text-gray-500 mt-1">
                Click "Generate Groups" to create groups based on student preferences
              </p>
            </div>
          )}
        </div>
      </div>
    </TopbarWithSidebar>
  );
};

export default InstructorGroups; 
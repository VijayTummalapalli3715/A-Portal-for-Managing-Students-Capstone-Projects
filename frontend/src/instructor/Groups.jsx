import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopbarWithSidebar from "@/pages/TopbarWithSidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Calendar, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const Groups = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5006/api/groups", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch groups");
      }

      const data = await response.json();
      setGroups(data);
    } catch (error) {
      toast.error("Failed to load groups");
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = () => {
    navigate("/instructor/groups/create");
  };

  if (loading) {
    return (
      <TopbarWithSidebar>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </TopbarWithSidebar>
    );
  }

  return (
    <TopbarWithSidebar>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Project Groups</h1>
          <Button
            onClick={handleCreateGroup}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Group
          </Button>
        </div>

        {groups.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Groups Yet</h3>
              <p className="text-gray-500 text-center mb-6">
                Start by creating a new project group for students
              </p>
              <Button
                onClick={handleCreateGroup}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create First Group
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span>{group.name}</span>
                    <span className="text-sm font-normal text-gray-500">
                      {group.member_count} members
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        Created on {new Date(group.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Project: {group.project_name || "Not assigned"}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-4 flex items-center justify-center gap-2"
                      onClick={() => navigate(`/instructor/groups/${group.id}`)}
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </TopbarWithSidebar>
  );
};

export default Groups; 
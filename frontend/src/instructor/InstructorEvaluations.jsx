import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TopbarWithSidebar from "@/pages/TopbarWithSidebar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Calendar, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const InstructorEvaluations = () => {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Simulate fetching evaluations data
    const fetchEvaluations = async () => {
      try {
        // In a real application, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulated data
        setEvaluations([
          {
            id: 1,
            teamName: "Team Alpha",
            projectTitle: "E-commerce Platform",
            date: "2024-04-15",
            time: "10:00 AM",
            status: "upcoming",
            priority: "high"
          },
          {
            id: 2,
            teamName: "Team Beta",
            projectTitle: "Social Media Dashboard",
            date: "2024-04-16",
            time: "2:00 PM",
            status: "completed",
            priority: "medium"
          },
          {
            id: 3,
            teamName: "Team Gamma",
            projectTitle: "Healthcare Management System",
            date: "2024-04-17",
            time: "11:30 AM",
            status: "upcoming",
            priority: "low"
          }
        ]);
      } catch (error) {
        console.error("Error fetching evaluations:", error);
        toast.error("Failed to load evaluations");
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredEvaluations = evaluations.filter(evaluation =>
    evaluation.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    evaluation.projectTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <TopbarWithSidebar>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Evaluations</h1>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => navigate("/instructor/evaluations/schedule")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule Evaluation
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search evaluations..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Evaluations List */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Evaluations</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredEvaluations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No evaluations found
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvaluations.map((evaluation) => (
                  <div
                    key={evaluation.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="space-y-1">
                      <h3 className="font-medium text-gray-900">{evaluation.teamName}</h3>
                      <p className="text-sm text-gray-500">{evaluation.projectTitle}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {evaluation.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {evaluation.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(evaluation.priority)}`}>
                        {evaluation.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(evaluation.status)}`}>
                        {evaluation.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TopbarWithSidebar>
  );
};

export default InstructorEvaluations; 
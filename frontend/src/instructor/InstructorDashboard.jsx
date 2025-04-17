import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TopbarWithSidebar from "@/pages/TopbarWithSidebar";
import { Users, BookOpen, ClipboardList, Calendar, Award, AlertCircle, Search, Filter, Plus, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    {
      title: "Total Students",
      value: "0",
      icon: Users,
      color: "bg-blue-500",
      change: "Loading...",
    },
    {
      title: "Active Projects",
      value: "0",
      icon: BookOpen,
      color: "bg-green-500",
      change: "Loading...",
    },
    {
      title: "Pending Evaluations",
      value: "0",
      icon: ClipboardList,
      color: "bg-orange-500",
      change: "Loading...",
    },
    {
      title: "Upcoming Deadlines",
      value: "0",
      icon: Calendar,
      color: "bg-purple-500",
      change: "Loading...",
    },
  ]);
  const [recentStudents, setRecentStudents] = useState([]);
  const [upcomingEvaluations, setUpcomingEvaluations] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch stats data
        const statsResponse = await axios.get('/api/instructor/stats');
        if (statsResponse.data) {
          setStats([
            {
              title: "Total Students",
              value: statsResponse.data.totalStudents || "0",
              icon: Users,
              color: "bg-blue-500",
              change: statsResponse.data.studentChange || "No change",
            },
            {
              title: "Active Projects",
              value: statsResponse.data.activeProjects || "0",
              icon: BookOpen,
              color: "bg-green-500",
              change: statsResponse.data.projectChange || "No change",
            },
            {
              title: "Pending Evaluations",
              value: statsResponse.data.pendingEvaluations || "0",
              icon: ClipboardList,
              color: "bg-orange-500",
              change: statsResponse.data.evaluationChange || "No change",
            },
            {
              title: "Upcoming Deadlines",
              value: statsResponse.data.upcomingDeadlines || "0",
              icon: Calendar,
              color: "bg-purple-500",
              change: statsResponse.data.deadlineChange || "No change",
            },
          ]);
        }
        
        // Fetch recent students data
        const studentsResponse = await axios.get('/api/instructor/recent-students');
        if (studentsResponse.data) {
          setRecentStudents(Array.isArray(studentsResponse.data) ? studentsResponse.data : []);
        } else {
          setRecentStudents([]);
        }
        
        // Fetch upcoming evaluations data
        const evaluationsResponse = await axios.get('/api/instructor/upcoming-evaluations');
        if (evaluationsResponse.data) {
          setUpcomingEvaluations(Array.isArray(evaluationsResponse.data) ? evaluationsResponse.data : []);
        } else {
          setUpcomingEvaluations([]);
        }
        
        // Fetch announcements data
        const announcementsResponse = await axios.get('/api/instructor/announcements');
        if (announcementsResponse.data) {
          setAnnouncements(Array.isArray(announcementsResponse.data) ? announcementsResponse.data : []);
        } else {
          setAnnouncements([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data. Please try again later.");
        setLoading(false);
        
        // Fallback to hardcoded data if API fails
        setStats([
          {
            title: "Total Students",
            value: "24",
            icon: Users,
            color: "bg-blue-500",
            change: "+3 this month",
          },
          {
            title: "Active Projects",
            value: "12",
            icon: BookOpen,
            color: "bg-green-500",
            change: "4 pending review",
          },
          {
            title: "Pending Evaluations",
            value: "8",
            icon: ClipboardList,
            color: "bg-orange-500",
            change: "Due this week",
          },
          {
            title: "Upcoming Deadlines",
            value: "5",
            icon: Calendar,
            color: "bg-purple-500",
            change: "Next 7 days",
          },
        ]);
        
        setRecentStudents([
          { id: 1, name: "John Doe", project: "E-commerce Platform", status: "In Progress", date: "2 days ago" },
          { id: 2, name: "Jane Smith", project: "Mobile App", status: "Submitted", date: "3 days ago" },
          { id: 3, name: "Alex Johnson", project: "Data Analytics Dashboard", status: "Under Review", date: "5 days ago" },
          { id: 4, name: "Sarah Williams", project: "AI Chatbot", status: "Submitted", date: "1 week ago" },
        ]);
        
        setUpcomingEvaluations([
          { id: 1, team: "Team Alpha", project: "AI Chatbot", date: "Tomorrow", priority: "High" },
          { id: 2, team: "Team Beta", project: "IoT Sensor Network", date: "In 3 days", priority: "Medium" },
          { id: 3, team: "Team Gamma", project: "Blockchain Wallet", date: "Next week", priority: "Low" },
        ]);
        
        setAnnouncements([
          { id: 1, title: "Mid-term evaluation deadline", content: "All project evaluations must be completed by Friday", date: "2 days ago", type: "alert" },
          { id: 2, title: "New student onboarding", content: "5 new students will join next week", date: "3 days ago", type: "info" },
          { id: 3, title: "System maintenance", content: "Platform will be down for maintenance on Sunday", date: "5 days ago", type: "warning" },
        ]);
      }
    };
    
    fetchDashboardData();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // In a real application, this would filter the data or make an API call
  };

  const handleScheduleEvaluation = () => {
    navigate("/instructor/evaluations/schedule");
  };

  const handleViewAll = (section) => {
    switch (section) {
      case "students":
        navigate("/instructor/students");
        break;
      case "evaluations":
        navigate("/instructor/evaluations");
        break;
      case "announcements":
        navigate("/instructor/announcements");
        break;
      default:
        break;
    }
  };

  const handleAddNew = (type) => {
    switch (type) {
      case "student":
        navigate("/instructor/students/add");
        break;
      case "project":
        navigate("/instructor/projects/create");
        break;
      case "announcement":
        navigate("/instructor/announcements/create");
        break;
      default:
        break;
    }
  };

  return (
    <TopbarWithSidebar>
      <div className="space-y-6">
        {/* Header with search and action buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Instructor Dashboard</h1>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search students, projects..." 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                onClick={handleScheduleEvaluation}
              >
                <Calendar className="w-4 h-4" />
                Schedule Evaluation
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </CardTitle>
                  <div className={`${stat.color} p-2 rounded-full`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Students */}
          <Card className="lg:col-span-2 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Students</CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAddNew("student")}
                  className="flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewAll("students")}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentStudents.length > 0 ? (
                    recentStudents.map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.project}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            student.status === "Submitted" ? "bg-green-100 text-green-800" :
                            student.status === "Under Review" ? "bg-yellow-100 text-yellow-800" :
                            "bg-blue-100 text-blue-800"
                          }`}>
                            {student.status}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">{student.date}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No recent students found
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Evaluations */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Upcoming Evaluations</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleViewAll("evaluations")}
              >
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingEvaluations.length > 0 ? (
                    upcomingEvaluations.map((evaluation) => (
                      <div key={evaluation.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{evaluation.team}</p>
                            <p className="text-sm text-gray-500">{evaluation.project}</p>
                          </div>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            evaluation.priority === "High" ? "bg-red-100 text-red-800" :
                            evaluation.priority === "Medium" ? "bg-yellow-100 text-yellow-800" :
                            "bg-green-100 text-green-800"
                          }`}>
                            {evaluation.priority}
                          </span>
                        </div>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{evaluation.date}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No upcoming evaluations
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Announcements */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Announcements</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleAddNew("announcement")}
                className="flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleViewAll("announcements")}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.length > 0 ? (
                  announcements.map((announcement) => (
                    <div key={announcement.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className={`p-2 rounded-full ${
                        announcement.type === "alert" ? "bg-red-100" :
                        announcement.type === "warning" ? "bg-yellow-100" :
                        "bg-blue-100"
                      }`}>
                        {announcement.type === "alert" ? (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        ) : announcement.type === "warning" ? (
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                        ) : (
                          <Award className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{announcement.title}</h3>
                        <p className="text-sm text-gray-600">{announcement.content}</p>
                        <p className="text-xs text-gray-500 mt-1">{announcement.date}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No announcements
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TopbarWithSidebar>
  );
};

export default InstructorDashboard;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopbarWithSidebar from "@/pages/TopbarWithSidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MoreVertical, Plus, Search } from "lucide-react";

const StudentsList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5006/api/users/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      toast.error("Failed to load students");
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "submitted":
        return "bg-green-100 text-green-800";
      case "under review":
        return "bg-yellow-100 text-yellow-800";
      case "not started":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
          <h1 className="text-3xl font-bold text-gray-800">Students</h1>
          <Button
            onClick={() => navigate("/instructor/students/add")}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Student
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>All Students</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search students..."
                className="pl-8 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">NAME</th>
                    <th className="text-left py-3 px-4">EMAIL</th>
                    <th className="text-left py-3 px-4">PROJECT</th>
                    <th className="text-left py-3 px-4">STATUS</th>
                    <th className="text-left py-3 px-4">JOIN DATE</th>
                    <th className="text-center py-3 px-4">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{student.name}</td>
                        <td className="py-3 px-4">{student.email}</td>
                        <td className="py-3 px-4">{student.project || "Not Assigned"}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(student.status)}`}>
                            {student.status || "Not Started"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {new Date(student.join_date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button className="p-1 hover:bg-gray-100 rounded-full">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-gray-500">
                        No students found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </TopbarWithSidebar>
  );
};

export default StudentsList; 
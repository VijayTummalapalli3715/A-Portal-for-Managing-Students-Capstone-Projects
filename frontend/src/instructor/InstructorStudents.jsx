import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TopbarWithSidebar from "@/pages/TopbarWithSidebar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Filter, MoreVertical } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const InstructorStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        // In a real application, this would be an API call
        // For now, we'll use a timeout to simulate data fetching
        setTimeout(() => {
          setStudents([
            { id: 1, name: "John Doe", email: "john.doe@example.com", project: "E-commerce Platform", status: "In Progress", joinDate: "2023-09-15" },
            { id: 2, name: "Jane Smith", email: "jane.smith@example.com", project: "Mobile App", status: "Submitted", joinDate: "2023-09-10" },
            { id: 3, name: "Alex Johnson", email: "alex.johnson@example.com", project: "Data Analytics Dashboard", status: "Under Review", joinDate: "2023-09-05" },
            { id: 4, name: "Sarah Williams", email: "sarah.williams@example.com", project: "AI Chatbot", status: "Submitted", joinDate: "2023-08-28" },
            { id: 5, name: "Michael Brown", email: "michael.brown@example.com", project: "Blockchain Wallet", status: "In Progress", joinDate: "2023-08-20" },
            { id: 6, name: "Emily Davis", email: "emily.davis@example.com", project: "IoT Sensor Network", status: "Not Started", joinDate: "2023-08-15" },
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast.error("Failed to load students. Please try again later.");
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleAddStudent = () => {
    navigate("/instructor/students/add");
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // In a real application, this would filter the data or make an API call
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.project.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <TopbarWithSidebar>
      <div className="space-y-6">
        {/* Header with search and action buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Students</h1>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search students..." 
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
                onClick={handleAddStudent}
              >
                <Plus className="w-4 h-4" />
                Add Student
              </Button>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>All Students</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Project
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Join Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{student.project}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              student.status === "Submitted" ? "bg-green-100 text-green-800" :
                              student.status === "Under Review" ? "bg-yellow-100 text-yellow-800" :
                              student.status === "Not Started" ? "bg-gray-100 text-gray-800" :
                              "bg-blue-100 text-blue-800"
                            }`}>
                              {student.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{student.joinDate}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                          No students found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TopbarWithSidebar>
  );
};

export default InstructorStudents; 
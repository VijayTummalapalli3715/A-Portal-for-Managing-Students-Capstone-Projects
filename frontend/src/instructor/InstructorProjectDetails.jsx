import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopbarWithSidebar from "@/pages/TopbarWithSidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Users, BookOpen, Tag } from "lucide-react";
import { toast } from 'sonner';

const InstructorProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token ? `${token.substring(0, 10)}...` : 'No token found');
      
      console.log(`Fetching project with ID: ${id}`);
      // Try the public endpoint
      const response = await fetch(`http://localhost:5006/api/projects/public/${id}`);

      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error('Failed to fetch project details');
      }

      const data = await response.json();
      console.log('Received project data:', data);
      setProject(data);
    } catch (error) {
      toast.error('Failed to load project details');
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
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

  if (!project) {
    return (
      <TopbarWithSidebar>
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Project not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The project you're looking for doesn't exist or you don't have access to it.
          </p>
          <div className="mt-6">
            <Button
              onClick={() => navigate('/instructor/projects')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Back to Projects
            </Button>
          </div>
        </div>
      </TopbarWithSidebar>
    );
  }

  return (
    <TopbarWithSidebar>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => navigate('/instructor/projects')}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">{project.title}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="text-gray-700">{project.description}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Requirements</h3>
                <p className="text-gray-700">{project.requirements}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {project.skills_required?.split(",").map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span>Maximum Team Size: {project.max_team_size}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Tag className="w-4 h-4" />
                <span>Category: {project.main_category}</span>
              </div>

              {project.sub_category && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Tag className="w-4 h-4" />
                  <span>Sub-category: {project.sub_category}</span>
                </div>
              )}

              {project.resources && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Resources</h3>
                  <p className="text-gray-700">{project.resources}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TopbarWithSidebar>
  );
};

export default InstructorProjectDetails; 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarWithSidebar from "@/pages/TopbarWithSidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from 'sonner';

const InstructorCreateProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    main_category: '',
    sub_category: '',
    skills_required: '',
    resources: '',
    max_team_size: 4,
    deadline: '',
  });

  const categories = [
    {
      main: "Web Development",
      sub: ["Frontend", "Backend", "Full Stack", "E-commerce", "CMS"]
    },
    {
      main: "Mobile Development",
      sub: ["iOS", "Android", "Cross-platform", "PWA"]
    },
    {
      main: "Data Science",
      sub: ["Machine Learning", "Data Analytics", "Big Data", "Data Visualization"]
    },
    {
      main: "Artificial Intelligence",
      sub: ["Natural Language Processing", "Computer Vision", "Robotics"]
    },
    {
      main: "Cybersecurity",
      sub: ["Network Security", "Application Security", "Cryptography"]
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMainCategoryChange = (e) => {
    const selectedMainCategory = e.target.value;
    setFormData(prev => ({
      ...prev,
      main_category: selectedMainCategory,
      sub_category: '' // Reset sub-category when main category changes
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5006/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create project');
      }

      toast.success('Project created successfully!');
      navigate('/instructor/projects');
    } catch (error) {
      toast.error(error.message || 'An error occurred while creating the project');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TopbarWithSidebar>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => navigate("/instructor/projects")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Create New Project</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Project Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Maximum Team Size
                  </label>
                  <input
                    type="number"
                    name="max_team_size"
                    value={formData.max_team_size}
                    onChange={handleChange}
                    min="2"
                    max="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Main Category
                  </label>
                  <select
                    name="main_category"
                    value={formData.main_category}
                    onChange={handleMainCategoryChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.main} value={category.main}>
                        {category.main}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Sub Category
                  </label>
                  <select
                    name="sub_category"
                    value={formData.sub_category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={!formData.main_category}
                  >
                    <option value="">Select Sub-Category</option>
                    {categories
                      .find(cat => cat.main === formData.main_category)
                      ?.sub.map(sub => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    Project Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    Requirements
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Required Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="skills_required"
                    value={formData.skills_required}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Project Deadline
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    Resources (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="resources"
                    value={formData.resources}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Documentation, APIs, Development Tools"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/instructor/projects")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </TopbarWithSidebar>
  );
};

export default InstructorCreateProject; 
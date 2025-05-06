// ✅ Refactored CreateProject.jsx for fluid UX and cleaner positioning
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TopbarWithSidebar from "@/pages/TopbarWithSidebar";
import { toast } from "react-hot-toast";

const CreateProject = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    skills_required: "",
    expected_outcomes: "",
    flexibility: "",
    difficulty: "",
    total_hours: "",
    main_category: "",
    sub_categories: "",
    team_size: "",
    start_date: "",
    end_date: "",
    selected_instructors: [],
  });

  const [instructors, setInstructors] = useState([]);
  const [loadingInstructors, setLoadingInstructors] = useState(true);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5006/api/users/instructors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch instructors");
        }

        const data = await response.json();
        setInstructors(data);
      } catch (error) {
        console.error("Error fetching instructors:", error);
        toast.error("Failed to load instructors");
      } finally {
        setLoadingInstructors(false);
      }
    };

    fetchInstructors();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleInstructorChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setForm(prev => ({
      ...prev,
      selected_instructors: selectedOptions
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to create a project");
        navigate("/login");
        return;
      }

      // Map frontend fields to backend expected fields
      const mappedForm = {
        title: form.title,
        description: form.description,
        requirements: form.expected_outcomes, // or add a requirements field if needed
        main_category: form.main_category,
        sub_category: form.sub_categories, // or rename in the form
        skills_required: form.skills_required,
        resources: form.resources,
        max_team_size: form.team_size ? Number(form.team_size) : null,
        deadline: form.end_date ? form.end_date : null,
        selected_instructors: form.selected_instructors,
      };

      const response = await fetch("http://localhost:5006/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(mappedForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create project");
      }

      navigate("/client/projects", { state: { projectCreated: true } });
    } catch (error) {
      console.error("Error creating project:", error);
      alert(error.message || "Failed to create project. Please try again.");
    }
  };

  return (
    <TopbarWithSidebar>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Create New Project</h1>
          <Button variant="outline" onClick={() => navigate("/client/projects")}>
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Required Skills</label>
                <input
                  type="text"
                  name="skills_required"
                  value={form.skills_required}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., React, Node.js, Python"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Expected Outcomes</label>
                <textarea
                  name="expected_outcomes"
                  value={form.expected_outcomes}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Flexibility</label>
                  <select
                    name="flexibility"
                    value={form.flexibility}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select flexibility</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                  <select
                    name="difficulty"
                    value={form.difficulty}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select difficulty</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Hours</label>
                  <input
                    type="number"
                    name="total_hours"
                    value={form.total_hours}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Team Size</label>
                  <input
                    type="number"
                    name="team_size"
                    value={form.team_size}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Main Category</label>
                <input
                  type="text"
                  name="main_category"
                  value={form.main_category}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Sub Categories</label>
                <input
                  type="text"
                  name="sub_categories"
                  value={form.sub_categories}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., Web Development, Mobile App"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={form.start_date}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    value={form.end_date}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select Instructors (Optional)
                </label>
                <select
                  multiple
                  name="selected_instructors"
                  value={form.selected_instructors}
                  onChange={handleInstructorChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {loadingInstructors ? (
                    <option>Loading instructors...</option>
                  ) : (
                    instructors.map((instructor) => (
                      <option key={instructor.id} value={instructor.id}>
                        {instructor.name} ({instructor.department || 'No department'})
                      </option>
                    ))
                  )}
                </select>
                <p className="text-sm text-gray-500">
                  Hold Ctrl/Cmd to select multiple instructors. If none selected, all instructors will be notified.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate("/client/projects")}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Create Project
            </Button>
          </div>
        </form>
      </div>
    </TopbarWithSidebar>
  );
};

export default CreateProject;
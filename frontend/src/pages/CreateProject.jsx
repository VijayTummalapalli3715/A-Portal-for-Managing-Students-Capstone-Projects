import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "@/components/ui/sidebar";
import { getAuth } from "firebase/auth";




const CreateProject = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: "",
    expectedOutcomes: "",
    flexibility: "",
    difficulty: "",
    totalHours: "",
    mainCategory: "",
    subCategories: "",
    teamSize: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


const handleSubmit = async (e) => {
  e.preventDefault();

  const projectData = {
    title: form.title,
    description: form.description,
    skills_required: form.skills,
    expected_outcomes: form.expectedOutcomes,
    flexibility: form.flexibility,
    difficulty: form.difficulty,
    total_hours: form.totalHours,
    main_category: form.mainCategory,
    sub_categories: form.subCategories,
    team_size: form.teamSize,
    start_date: form.startDate,
    end_date: form.endDate,
    resources: "",
  };

  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("User not logged in.");
      return;
    }

    const token = await user.getIdToken();

    const response = await fetch("http://localhost:5006/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Send token here
      },
      body: JSON.stringify(projectData),
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message);
      navigate("/client/dashboard");
    } else {
      console.error("Error:", result.message);
      alert("Failed to submit project.");
    }
  } catch (error) {
    console.error("Submission error:", error);
    alert("An error occurred while submitting the project.");
  }
};


  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Project Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Project Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="w-full mt-1 px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Expected Outcomes</label>
                <textarea
                  name="expectedOutcomes"
                  value={form.expectedOutcomes}
                  onChange={handleChange}
                  rows={2}
                  className="w-full mt-1 px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Required Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="e.g., React, Python, SQL"
                  className="w-full mt-1 px-3 py-2 border rounded"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Project Flexibility</label>
                  <select
                    name="flexibility"
                    value={form.flexibility}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded"
                  >
                    <option value="">Select</option>
                    <option value="Fixed">Fixed</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium">Difficulty Level</label>
                  <select
                    name="difficulty"
                    value={form.difficulty}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded"
                  >
                    <option value="">Select</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Total Hours Required</label>
                <input
                  type="number"
                  name="totalHours"
                  value={form.totalHours}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Main Category</label>
                  <input
                    type="text"
                    name="mainCategory"
                    value={form.mainCategory}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Sub Categories</label>
                  <input
                    type="text"
                    name="subCategories"
                    value={form.subCategories}
                    onChange={handleChange}
                    placeholder="Separate with commas"
                    className="w-full mt-1 px-3 py-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Team Size</label>
                <input
                  type="number"
                  name="teamSize"
                  value={form.teamSize}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded"
                  />
                </div>
              </div>
              <Button type="submit" className="mt-4">
                Submit Project
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateProject;

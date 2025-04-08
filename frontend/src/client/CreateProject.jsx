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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        navigate("/client/dashboard");
      } else {
        alert("Failed to submit project.");
      }
    } catch (error) {
      alert("An error occurred while submitting the project.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-white to-sky-100 flex">
      <Sidebar />

      <main className="flex-1 flex flex-col items-center justify-start py-20 px-8">
        <Card className="w-full max-w-7xl shadow-xl rounded-2xl border border-blue-200 bg-white">
          <CardHeader className="bg-blue-50 rounded-t-2xl p-6 border-b border-blue-200">
            <CardTitle className="text-3xl font-bold text-blue-700 text-center">
              ✨ Create New Project
            </CardTitle>
          </CardHeader>

          <CardContent className="px-12 pt-10 pb-12 space-y-12">
            <form id="createProjectForm" onSubmit={handleSubmit} className="space-y-12">

              {/* Section 1: Project Basics */}
              <div>
                <h3 className="text-xl font-semibold text-blue-600 mb-6">📌 Project Basics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { label: "Project Title", name: "title" },
                    { label: "Required Skills", name: "skills", placeholder: "e.g., React, Python, SQL" },
                    { label: "Main Category", name: "mainCategory" },
                    { label: "Sub Categories", name: "subCategories", placeholder: "Separate with commas" },
                    { label: "Total Hours Required", name: "totalHours", type: "number" },
                    { label: "Team Size", name: "teamSize", type: "number" },
                  ].map((field, i) => (
                    <div key={i}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{field.label}</label>
                      <input
                        type={field.type || "text"}
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder || ""}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Description */}
              <div>
                <h3 className="text-xl font-semibold text-blue-600 mb-6">📝 Description</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Project Description</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Expected Outcomes</label>
                    <textarea
                      name="expectedOutcomes"
                      value={form.expectedOutcomes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Settings */}
              <div>
                <h3 className="text-xl font-semibold text-blue-600 mb-6">⚙️ Settings & Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Project Flexibility</label>
                    <select
                      name="flexibility"
                      value={form.flexibility}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="Fixed">Fixed</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty Level</label>
                    <select
                      name="difficulty"
                      value={form.difficulty}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={form.startDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={form.endDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Spacer Before Submit */}
              <div className="h-12" />
            </form>
          </CardContent>
        </Card>

        {/* Submit Button OUTSIDE form */}
        <div className="mt-10 flex justify-center">
          <button
            type="submit"
            form="createProjectForm"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-3 text-lg font-semibold rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300 ease-in-out"
          >
            Submit Project
          </button>
        </div>
      </main>
    </div>
  );
};

export default CreateProject;

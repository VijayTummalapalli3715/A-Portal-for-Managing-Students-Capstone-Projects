// ✅ Refactored CreateProject.jsx for fluid UX and cleaner positioning
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

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-white to-sky-100 flex">
      <Sidebar />
      <main className="flex-1 flex flex-col items-center py-20 px-8 overflow-y-auto">
        <Card className="w-full max-w-7xl rounded-2xl shadow-xl border border-blue-200 bg-white">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {["title", "skills", "mainCategory", "subCategories", "totalHours", "teamSize"].map((key, i) => (
                    <div key={i}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                      </label>
                      <input
                        type={key.includes("Hours") || key.includes("Size") ? "number" : "text"}
                        name={key}
                        value={form[key]}
                        onChange={handleChange}
                        placeholder={key === "skills" ? "e.g., React, Python" : ""}
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Description */}
              <div>
                <h3 className="text-xl font-semibold text-blue-600 mb-6">📝 Description</h3>
                <div className="space-y-6">
                  {["description", "expectedOutcomes"].map((key, i) => (
                    <div key={i}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {key === "description" ? "Project Description" : "Expected Outcomes"}
                      </label>
                      <textarea
                        name={key}
                        value={form[key]}
                        onChange={handleChange}
                        rows={key === "description" ? 4 : 3}
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Settings */}
              <div>
                <h3 className="text-xl font-semibold text-blue-600 mb-6">⚙️ Settings & Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    {
                      name: "flexibility",
                      label: "Project Flexibility",
                      options: ["", "Fixed", "Flexible"],
                    },
                    {
                      name: "difficulty",
                      label: "Difficulty Level",
                      options: ["", "Beginner", "Intermediate", "Advanced"],
                    },
                  ].map(({ name, label, options }, i) => (
                    <div key={i}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
                      <select
                        name={name}
                        value={form[name]}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        {options.map((opt, idx) => (
                          <option key={idx} value={opt}>
                            {opt || "Select"}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}

                  {["startDate", "endDate"].map((key, i) => (
                    <div key={i}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {key === "startDate" ? "Start Date" : "End Date"}
                      </label>
                      <input
                        type="date"
                        name={key}
                        value={form[key]}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

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
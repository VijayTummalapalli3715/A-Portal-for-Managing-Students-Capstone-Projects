import React, { useEffect, useState } from "react";
import TopbarWithSidebar from "../pages/TopbarWithSidebar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, Reorder } from "framer-motion";
import { toast } from "sonner";

const ProvidePreferences = () => {
  const [preferredProjects, setPreferredProjects] = useState([]);
  const [availableProjects, setAvailableProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch student's current preferences
        const preferencesRes = await fetch("http://localhost:5006/api/preferences/student", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // Fetch all available projects
        const projectsRes = await fetch("http://localhost:5006/api/projects", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!preferencesRes.ok || !projectsRes.ok) {
          const preferencesMessage = await preferencesRes.json();
          const projectsMessage = await projectsRes.json();
          throw new Error(preferencesMessage.message || projectsMessage.message || "Failed to fetch data");
        }

        const preferences = await preferencesRes.json();
        const projects = await projectsRes.json();

        setPreferredProjects(preferences);
        
        // Filter out already selected projects
        const selectedProjectIds = preferences.map(p => p.id);
        const remainingProjects = projects.filter(p => !selectedProjectIds.includes(p.id));
        setAvailableProjects(remainingProjects);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddPreference = async (project) => {
    if (preferredProjects.length >= 3) {
      toast.error("You can only select up to 3 projects");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5006/api/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ project_id: project.id }),
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "Failed to add preference");
      }

      // Update state
      setPreferredProjects([...preferredProjects, project]);
      setAvailableProjects(availableProjects.filter(p => p.id !== project.id));
      toast.success(`Added ${project.title} to your preferences`);
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleRemovePreference = async (project) => {
    try {
      // Update UI state immediately for better user experience
      const updatedPreferredProjects = preferredProjects.filter(p => p.id !== project.id);
      setPreferredProjects(updatedPreferredProjects);
      setAvailableProjects([...availableProjects, project].sort((a, b) => a.title.localeCompare(b.title)));
      
      // Show success message
      toast.success(`Removed ${project.title} from your preferences`);
      
      // Then try to update the backend
      const token = localStorage.getItem("token");
      console.log('Removing preference:', { projectId: project.id, token });
      
      try {
        const res = await fetch(`http://localhost:5006/api/preferences?projectId=${project.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Remove preference request:', {
          url: `http://localhost:5006/api/preferences?projectId=${project.id}`,
          method: 'DELETE',
          projectId: project.id
        });

        console.log('Remove preference response:', { status: res.status, ok: res.ok });

        if (!res.ok) {
          const errorText = await res.text();
          console.error('Error response:', errorText);
          console.warn('Backend removal failed, but UI was updated');
        }
      } catch (apiError) {
        console.error('API error when removing preference:', apiError);
        console.warn('Backend removal failed, but UI was updated');
      }
    } catch (err) {
      console.error('Remove preference error:', err);
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleSaveRankings = async () => {
    try {
      const token = localStorage.getItem("token");
      const rankedProjectIds = preferredProjects.map((project) => project.id);

      const res = await fetch("http://localhost:5006/api/preferences/rank", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ projectRankings: rankedProjectIds }),
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "Failed to save rankings");
      }

      toast.success("Project preferences ranked successfully!");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <TopbarWithSidebar>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Your Preferred Projects</h1>
          {preferredProjects.length > 0 && (
            <Button onClick={handleSaveRankings} className="bg-green-600 hover:bg-green-700">
              Save Rankings
            </Button>
          )}
        </div>

        {loading && <p className="text-gray-600">Loading preferences...</p>}
        {error && <p className="text-red-500 font-medium">{error}</p>}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Preferred Projects */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Your Selected Projects</h2>
            {preferredProjects.length > 0 ? (
              <Reorder.Group
                axis="y"
                values={preferredProjects}
                onReorder={(newOrder) => {
                  // If the project is dragged out of the preferred projects list, remove it
                  const removedProject = preferredProjects.find(
                    (project) => !newOrder.some((p) => p.id === project.id)
                  );

                  if (removedProject) {
                    handleRemovePreference(removedProject);
                  } else {
                    // Otherwise, just update the order
                    setPreferredProjects(newOrder);
                  }
                }}
                className="space-y-4"
              >
                {preferredProjects.map((project, index) => (
                  <Reorder.Item 
                    key={project.id} 
                    value={project} 
                    className="cursor-grab active:cursor-grabbing relative group"
                  >
                    <Card className="shadow-md bg-white rounded-xl">
                      <button 
                        onClick={() => handleRemovePreference(project)}
                        className="absolute top-2 right-2 z-10 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        aria-label="Remove project"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <CardHeader className="flex flex-row items-center">
                        <div className="mr-4 text-gray-500 font-bold">{index + 1}.</div>
                        <div className="flex-grow">
                          <CardTitle className="text-xl text-blue-700">{project.title}</CardTitle>
                          <CardDescription className="text-gray-600">Client: {project.client}</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-700">{project.description}</p>
                      </CardContent>
                    </Card>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            ) : (
              <p className="text-gray-600">No projects selected yet</p>
            )}
          </div>

          {/* Available Projects */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Available Projects</h2>
            {availableProjects.length > 0 ? (
              <div className="space-y-4">
                {availableProjects.map((project) => (
                  <Card key={project.id} className="shadow-md bg-white rounded-xl">
                    <CardHeader className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-xl text-blue-700">{project.title}</CardTitle>
                        <CardDescription className="text-gray-600">Client: {project.client}</CardDescription>
                      </div>
                      {preferredProjects.length < 3 && (
                        <Button 
                          onClick={() => handleAddPreference(project)} 
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Add Preference
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-700">{project.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No available projects</p>
            )}
          </div>
        </div>
      </motion.div>
    </TopbarWithSidebar>
  );
};

export default ProvidePreferences;
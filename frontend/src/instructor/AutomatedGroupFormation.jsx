import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import TopbarWithSidebar from "@/pages/TopbarWithSidebar";

// Simple UI components that don't require special imports
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>{children}</div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`pb-2 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-xl font-semibold ${className}`}>{children}</h3>
);

const CardDescription = ({ children, className = "" }) => (
  <p className={`text-sm text-gray-500 ${className}`}>{children}</p>
);

const CardContent = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

const Button = ({ children, onClick, disabled, variant = "default", className = "" }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "outline":
        return "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50";
      default:
        return "bg-blue-600 text-white hover:bg-blue-700";
    }
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md font-medium transition-colors ${getVariantClasses()} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

const Tabs = ({ children, value, onValueChange, className = "" }) => {
  return (
    <div className={className}>
      {React.Children.map(children, child => {
        if (child.type === TabsList || child.type === TabsContent) {
          return React.cloneElement(child, { value, onValueChange });
        }
        return child;
      })}
    </div>
  );
};

const TabsList = ({ children, className = "" }) => (
  <div className={`flex border-b ${className}`}>{children}</div>
);

const TabsTrigger = ({ children, value, className = "" }) => {
  const isActive = value === window.activeTab;
  return (
    <button
      className={`px-4 py-2 font-medium ${isActive ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'} ${className}`}
      onClick={() => window.setActiveTab(value)}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ children, value, className = "" }) => {
  return value === window.activeTab ? <div className={className}>{children}</div> : null;
};

const Table = ({ children, className = "" }) => (
  <table className={`min-w-full divide-y divide-gray-200 ${className}`}>{children}</table>
);

const TableHeader = ({ children }) => <thead>{children}</thead>;
const TableBody = ({ children }) => <tbody className="divide-y divide-gray-200">{children}</tbody>;
const TableRow = ({ children }) => <tr>{children}</tr>;
const TableHead = ({ children, className = "" }) => (
  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>{children}</th>
);
const TableCell = ({ children, className = "" }) => (
  <td className={`px-6 py-4 whitespace-nowrap ${className}`}>{children}</td>
);

const Select = ({ children, value, onValueChange, className = "" }) => {
  return (
    <select 
      value={value} 
      onChange={(e) => onValueChange(e.target.value)}
      className={`block w-full rounded-md border border-gray-300 py-2 px-3 ${className}`}
    >
      {children}
    </select>
  );
};

const SelectTrigger = ({ children, className = "" }) => <div className={className}>{children}</div>;
const SelectValue = ({ placeholder }) => <span>{placeholder}</span>;
const SelectContent = ({ children }) => children;
const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;

const Progress = ({ value, className = "" }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
  </div>
);

const Loader2 = ({ className = "" }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
  </svg>
);

const AutomatedGroupFormation = () => {
  const [activeTab, setActiveTab] = useState("statistics");
  // Make activeTab and setActiveTab available to the TabsTrigger and TabsContent components
  window.activeTab = activeTab;
  window.setActiveTab = setActiveTab;
  
  const [groupSize, setGroupSize] = useState(3);
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [previewGroups, setPreviewGroups] = useState(null);
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [creating, setCreating] = useState(false);

  // Fetch preference statistics on component mount
  useEffect(() => {
    fetchStatistics();
  }, []);

  // Fetch preference statistics
  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5006/api/group-formation/statistics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to fetch statistics");
      }

      const data = await res.json();
      setStatistics(data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      toast.error(error.message || "Failed to fetch statistics");
    } finally {
      setLoading(false);
    }
  };

  // Preview groups based on selected group size
  const handlePreviewGroups = async () => {
    try {
      setPreviewLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5006/api/group-formation/preview?groupSize=${groupSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        
        // Handle specific error cases
        if (data.message && data.message.includes("No available projects")) {
          toast.error(
            "No approved projects found. Please approve some projects before forming groups.",
            { duration: 5000 }
          );
          return;
        }
        
        throw new Error(data.message || "Failed to preview groups");
      }

      const data = await res.json();
      setPreviewGroups(data);
      setActiveTab("preview");
    } catch (error) {
      console.error("Error previewing groups:", error);
      
      // Check for specific error messages
      if (error.message && error.message.includes("No available projects")) {
        toast.error(
          "No approved projects found. Please approve some projects before forming groups.",
          { duration: 5000 }
        );
      } else {
        toast.error(error.message || "Failed to preview groups");
      }
    } finally {
      setPreviewLoading(false);
    }
  };

  // Create groups based on selected group size
  const handleCreateGroups = async () => {
    try {
      // Check if we have preview data first
      if (!previewGroups && !window.confirm("It's recommended to preview groups first. Continue anyway?")) {
        return;
      }
      
      if (!window.confirm("Are you sure you want to create these groups? This action cannot be undone.")) {
        return;
      }
      
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // First check if there are enough students with preferences
      const statsRes = await fetch("http://localhost:5006/api/group-formation/statistics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.studentsWithPreferences < 1) {
          throw new Error("No students have provided preferences yet. Cannot form groups.");
        }
      }
      
      const res = await fetch("http://localhost:5006/api/group-formation/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ groupSize }),
      });

      let errorMessage = "Failed to create groups";
      
      if (!res.ok) {
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
          
          // Handle specific error cases
          if (errorMessage && errorMessage.includes("No available projects")) {
            toast.error(
              "No approved projects found. Please approve some projects before forming groups.",
              { duration: 5000 }
            );
            setLoading(false);
            return;
          }
        } catch (jsonError) {
          errorMessage = `Server error (${res.status}): ${errorMessage}`;
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      
      if (!data || !data.groupCount) {
        throw new Error("Server returned an invalid response");
      }
      
      setCreationSuccess(true);
      toast.success(`Successfully created ${data.groupCount} groups!`);
      setActiveTab("success");
    } catch (error) {
      console.error("Error creating groups:", error);
      
      // Check for specific error messages
      if (error.message && error.message.includes("No available projects")) {
        toast.error(
          "No approved projects found. Please approve some projects before forming groups.",
          { duration: 5000 }
        );
      } else {
        toast.error(error.message || "Failed to create groups");
      }
    } finally {
      setLoading(false);
    }
  };

  // Render preference statistics
  const renderStatistics = () => {
    if (!statistics) return <div className="text-center py-4">No statistics available</div>;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{statistics.totalStudents}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">With Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{statistics.studentsWithPreferences}</p>
              <Progress 
                value={(statistics.studentsWithPreferences / statistics.totalStudents) * 100} 
                className="mt-2"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Available Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{statistics.totalProjects}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Most Popular Projects</CardTitle>
            <CardDescription>
              Based on weighted preference scores (1st choice = 3 points, 2nd = 2 points, 3rd = 1 point)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>1st Choice</TableHead>
                  <TableHead>2nd Choice</TableHead>
                  <TableHead>3rd Choice</TableHead>
                  <TableHead>Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statistics.mostPopularProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>{project.firstChoiceCount}</TableCell>
                    <TableCell>{project.secondChoiceCount}</TableCell>
                    <TableCell>{project.thirdChoiceCount}</TableCell>
                    <TableCell>{project.weightedScore}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render group preview
  const renderPreview = () => {
    if (!previewGroups) return <div className="text-center py-4">No preview available</div>;

    const { groups, stats } = previewGroups;

    return (
      <div className="space-y-6">
        {/* Add a prominent Create Groups button at the top of the preview */}
        <div className="flex justify-center mb-4">
          <Button 
            onClick={handleCreateGroups}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 text-lg shadow-lg"
          >
            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Create These Groups Now
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Total Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalGroups}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Avg. Group Size</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.averageGroupSize.toFixed(1)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Satisfaction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{(stats.satisfactionRate * 100).toFixed(1)}%</p>
              <Progress 
                value={stats.satisfactionRate * 100} 
                className="mt-2"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">1st Choice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {stats.firstChoiceAssignments} 
                <span className="text-sm font-normal text-gray-500 ml-1">
                  ({((stats.firstChoiceAssignments / stats.totalStudents) * 100).toFixed(1)}%)
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Group Preview</CardTitle>
            <CardDescription>
              This is how groups would be formed with a group size of {groupSize}
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[500px] overflow-y-auto">
            {groups.map((group, index) => (
              <Card key={index} className="mb-4">
                <CardHeader className="pb-2">
                  <CardTitle>{group.project_title}</CardTitle>
                  <CardDescription>
                    Client: {group.client_name} | Members: {group.members.length}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Preference</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.members.map((member, i) => (
                        <TableRow key={i}>
                          <TableCell>{member.student_name}</TableCell>
                          <TableCell>
                            {member.preference_score === 3 ? (
                              <span className="text-green-600 font-medium">1st Choice</span>
                            ) : member.preference_score === 2 ? (
                              <span className="text-blue-600 font-medium">2nd Choice</span>
                            ) : member.preference_score === 1 ? (
                              <span className="text-orange-600 font-medium">3rd Choice</span>
                            ) : (
                              <span className="text-gray-600 font-medium">No Preference</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render success message
  const renderSuccess = () => {
    return (
      <div className="text-center py-8">
        <div className="mb-4 text-green-600 text-6xl">✓</div>
        <h2 className="text-2xl font-bold mb-2">Groups Created Successfully!</h2>
        <p className="text-gray-600 mb-6">
          The groups have been created and students have been assigned to their groups.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => window.location.href = "/instructor/groups"}>
            View All Groups
          </Button>
          <Button variant="outline" onClick={() => setActiveTab("statistics")}>
            Back to Statistics
          </Button>
        </div>
      </div>
    );
  };

  return (
    <TopbarWithSidebar>
      <div className="container mx-auto py-6 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">Automated Group Formation</h1>
        
        {/* VERY PROMINENT CREATE GROUPS BUTTON */}
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-green-700 mb-4">Create Groups Automatically</h2>
          <p className="mb-4">Form groups based on student preferences with just a few clicks.</p>
          
          <div className="flex items-center gap-4 mb-6">
            <label htmlFor="groupSize" className="font-medium text-lg">
              Group Size:
            </label>
            <select
              value={groupSize.toString()}
              onChange={(e) => setGroupSize(parseInt(e.target.value))}
              className="block rounded-md border border-gray-300 py-2 px-3 w-24"
            >
              {[2, 3, 4, 5, 6].map((size) => (
                <option key={size} value={size.toString()}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={handlePreviewGroups}
              disabled={previewLoading}
              className="px-6 py-3 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              {previewLoading && (
                <svg className="animate-spin mr-2 h-5 w-5 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              Preview Groups
            </button>
            
            <button 
              onClick={handleCreateGroups}
              disabled={loading}
              className="px-8 py-3 rounded-md font-bold bg-green-600 text-white hover:bg-green-700 transition-colors text-lg shadow-md"
            >
              {loading && (
                <svg className="animate-spin mr-2 h-5 w-5 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              CREATE GROUPS NOW
            </button>
          </div>
        </div>
        
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'statistics' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('statistics')}
          >
            Statistics
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'preview' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'manual' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('manual')}
          >
            Manual Formation
          </button>
        </div>
        
        {activeTab === 'statistics' && (
          <div className="mt-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              renderStatistics()
            )}
          </div>
        )}
        
        {activeTab === 'preview' && (
          <div className="mt-6">
            {previewLoading ? (
              <div className="flex justify-center items-center py-12">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              renderPreview()
            )}
          </div>
        )}
        
        {activeTab === 'manual' && (
          <div className="mt-6 text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Manual Group Formation</h2>
            <p className="text-gray-600 mb-6">
              You can manually create and manage groups from the Groups page.
            </p>
            <button 
              onClick={() => window.location.href = "/instructor/groups"}
              className="px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Go to Groups Page
            </button>
          </div>
        )}
        
        {creationSuccess && activeTab === 'success' && renderSuccess()}
      </div>
    </TopbarWithSidebar>
  );
};

export default AutomatedGroupFormation;

import React from "react";
import TopbarWithSidebar from "../pages/TopbarWithSidebar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";

const AssignedProjects = () => {
  const project = {
    title: "AI Research",
    client: "Tech Innovations Ltd.",
    description: "Developing AI models for predictive analytics.",
    skills: ["Machine Learning", "Python", "Data Analysis"],
    resources: ["Project Guidelines", "Dataset A", "Reference Paper"],
  };

  const teamMembers = [
    { id: 1, name: "Alice Johnson", role: "Project Manager", email: "j.alice001@umb.edu" },
    { id: 2, name: "Bob Smith", role: "Lead Developer", email: "b.smith001@umb.edu" },
    { id: 3, name: "Charlie Davis", role: "Data Scientist", email: "c.davis001@umb.edu" },
  ];

  return (
    <TopbarWithSidebar>
      <div className="flex flex-col min-h-screen">
        {/* Main Content */}
        <motion.div
          className="flex-grow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-4xl font-bold mb-8 text-gray-800">Assigned Project Details</h1>

          <Card className="mb-8 shadow-md rounded-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-700">{project.title}</CardTitle>
              <CardDescription>Client: {project.client}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{project.description}</p>
              <div>
                <p className="font-semibold">Skills Required:</p>
                <ul className="list-disc list-inside text-gray-700">
                  {project.skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold">Resources:</p>
                <ul className="list-disc list-inside text-gray-700">
                  {project.resources.map((res, index) => (
                    <li key={index}>{res}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Team Members</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teamMembers.map((member) => (
                <Card key={member.id} className="p-4 shadow-md rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800">{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">Email: {member.email}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </motion.div>
      </div>
    </TopbarWithSidebar>
  );
};

export default AssignedProjects;

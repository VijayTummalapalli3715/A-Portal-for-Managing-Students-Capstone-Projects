import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const teamMembers = [
  {
    name: "Sree Rama Vijay Tummalapalli",
    role: "Full Stack Developer",
    github: "https://github.com/VijayTummalapalli3715",
    linkedin: "https://www.linkedin.com/in/sree-rama-vijay-tummalapalli-aabb91204/",
    image: "https://via.placeholder.com/150",
  },
  {
    name: "Sireesha Kuchimanchi",
    role: "Frontend Developer",
    github: "https://github.com/Sireesha2002",
    linkedin: "https://www.linkedin.com/in/sireesha-kuchimanchi-0959a41b3/",
    image: "https://via.placeholder.com/150",
  },
  {
    name: "GopiKrishna Nathani",
    role: "Backend Developer",
    github: "https://github.com/gopikrishna2313",
    linkedin: "https://www.linkedin.com/in/gopi-krishna-nathani44/",
    image: "https://via.placeholder.com/150",
  },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-800 to-green-600 text-white shadow-md fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-white text-sm font-semibold hover:text-yellow-300"
            >
              ←
            </Button>
            <h1 className="text-xl md:text-2xl font-bold">Capstone Project Management Portal</h1>
          </div>

          <nav className="flex gap-4 text-sm font-semibold">
            <Button variant="ghost" onClick={() => navigate("/home")}>Home</Button>
            <Button variant="ghost" onClick={() => navigate("/login")}>Login</Button>
            <Button variant="ghost" onClick={() => navigate("/about")}>About</Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-md"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-1 px-6 mt-32 mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Meet Our Team</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index} className="w-full max-w-sm shadow-lg">
              <CardHeader className="flex items-center flex-col">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={member.image} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="mt-2 text-lg font-semibold text-center">{member.name}</CardTitle>
                <CardDescription>{member.role}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  GitHub
                </a>{" "}
                |{" "}
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  LinkedIn
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-800 text-white text-sm py-4 text-center">
        © 2025 Capstone Portal. All rights reserved. | Contact us:{" "}
        <a href="mailto:support@capstoneportal.com" className="text-blue-300 underline">
          support@capstoneportal.com
        </a>{" "}
        | Phone: 123-456-7890
      </footer>
    </div>
  );
}

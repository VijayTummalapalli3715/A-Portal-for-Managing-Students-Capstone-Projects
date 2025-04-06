import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-green-800 text-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-white text-sm font-semibold hover:text-yellow-300"
            >
              ←
            </Button>
            <h1 className="text-xl font-bold">Capstone Project Management Portal</h1>
          </div>
          <nav className="flex gap-6 text-sm font-semibold">
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
      <main className="flex flex-col items-center justify-center flex-1 px-6 mt-24 mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
          Welcome to Capstone Project Management Portal
        </h1>
        <p className="text-gray-600 text-lg text-center max-w-2xl mb-10">
          Your one-stop platform for connecting students, instructors, and clients for managing capstone projects efficiently.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "For Students",
              desc: "Work on real-world projects and gain experience.",
              label: "Join as Student",
            },
            {
              title: "For Instructors",
              desc: "Help students connect with companies and guide them.",
              label: "Join as Instructor",
            },
            {
              title: "For Clients",
              desc: "Get innovative solutions from student projects.",
              label: "Join as Client",
            },
          ].map(({ title, desc, label }, idx) => (
            <Card key={idx} className="w-80 shadow-md flex flex-col justify-between">
              <CardHeader className="flex flex-col items-center">
                <div className="h-24 w-24 bg-gray-200 rounded-full mb-3" />
                <CardTitle className="text-center">{title}</CardTitle>
                <CardDescription className="text-center min-h-[48px] flex items-center justify-center">
                  {desc}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center mb-4">
                <Button
                  asChild
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-md"
                >
                  <Link to="/signup">{label}</Link>
                </Button>
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
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-100 to-gray-200 text-center p-6">
      {/* Navbar */}
      <header className="fixed top-0 w-full bg-green-700 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">Capstone Project Management Portal</h1>
        <nav className="space-x-6">
          <Button variant="ghost" onClick={() => navigate("/")}>Home</Button>
          <Button variant="ghost" onClick={() => navigate("/login")}>Login</Button>
          <Button variant="ghost" onClick={() => navigate("/about")}>About</Button>
          <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => navigate("/home")}>
            Get Started
          </Button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex flex-col justify-center items-center text-center space-y-6 mt-20">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to A Portal for Managing Students Capstone Projects</h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Your one-stop platform for connecting students, instructors, and clients.
        </p>
        <Button className="px-6 py-3 text-lg bg-orange-500 hover:bg-orange-600" onClick={() => navigate("/home")}>
          Get Started
        </Button>
      </main>

      {/* Footer */}
      <footer className="w-full mt-16 py-4 bg-gray-100 text-gray-600 text-center text-sm border-t">
        &copy; 2025 Capstone Portal. All rights reserved. | Contact us: 
        <a href="mailto:support@capstoneportal.com" className="text-blue-500 hover:underline"> support@capstoneportal.com</a> | Phone: 123-456-7890
      </footer>
    </div>
  );
}

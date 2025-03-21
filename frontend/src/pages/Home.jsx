import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
        Welcome to Capstone Project Management Portal
      </h1>
      <p className="text-gray-600 text-lg text-center max-w-2xl mb-6">
        Your one-stop platform for connecting students, instructors, and clients for managing capstone projects efficiently.
      </p>

      {/* Call to Action */}
      <Button asChild className="px-6 py-3 text-lg">
        <Link to="/signup">Get Started</Link>
      </Button>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <Card className="w-80 shadow-md">
          <CardHeader>
            <CardTitle>For Students</CardTitle>
            <CardDescription>Work on real-world projects and gain experience.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link to="/signup">Join as Student</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="w-80 shadow-md">
          <CardHeader>
            <CardTitle>For Instructors</CardTitle>
            <CardDescription>Help students connect with companies and guide them.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link to="/signup">Join as Instructor</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="w-80 shadow-md">
          <CardHeader>
            <CardTitle>For Clients</CardTitle>
            <CardDescription>Get innovative solutions from student projects.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link to="/signup">Join as Client</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

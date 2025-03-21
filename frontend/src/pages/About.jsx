import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Meet Our Team</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => (
          <Card key={index} className="w-full max-w-sm shadow-lg">
            <CardHeader className="flex items-center flex-col">
              <Avatar className="w-24 h-24">
                <AvatarImage src={member.image} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-2 text-lg">{member.name}</CardTitle>
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
    </div>
  );
}

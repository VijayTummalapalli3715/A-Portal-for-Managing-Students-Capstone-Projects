// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";

// export default function Signup() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "student",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     try {
//       const response = await fetch("http://localhost:5006/api/users/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });
  
//       const result = await response.json();
//       console.log(result);
  
//       if (response.ok) {
//         alert("Registration Successful");
//         navigate("/login");
//       } else {
//         alert(result.error || "Registration Failed");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Error occurred!");
//     }
//   };
  

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
//       <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
//         <h2 className="text-2xl font-bold text-gray-800 text-center">
//           Create an Account
//         </h2>
//         <form onSubmit={handleSubmit} className="mt-4">
//           <div className="mb-4">
//             <Label htmlFor="name">Full Name</Label>
//             <Input
//               type="text"
//               id="name"
//               name="name"
//               placeholder="Enter your full name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               type="email"
//               id="email"
//               name="email"
//               placeholder="Enter your email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <Label htmlFor="password">Password</Label>
//             <Input
//               type="password"
//               id="password"
//               name="password"
//               placeholder="Create a password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <Label htmlFor="role">Select Role</Label>
//             <select
//               id="role"
//               name="role"
//               value={formData.role}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-md"
//             >
//               <option value="student">Student</option>
//               <option value="instructor">Instructor</option>
//               <option value="client">Client</option>
//             </select>
//           </div>
//           <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
//             Sign Up
//           </Button>
//         </form>
//         <p className="mt-4 text-center text-gray-600">
//           Already have an account?{" "}
//           <a href="/login" className="text-blue-500 hover:underline">
//             Login
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebaseConfig";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Save name to Firebase Auth profile
      await updateProfile(userCredential.user, {
        displayName: formData.name,
      });

      alert("Registration Successful");
      navigate("/login");
    } catch (error) {
      console.error("Signup Error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <Label htmlFor="name">Full Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="role">Select Role</Label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="client">Client</option>
            </select>
          </div>
          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
            Sign Up
          </Button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}


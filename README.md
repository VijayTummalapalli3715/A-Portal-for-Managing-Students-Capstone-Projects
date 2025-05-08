A Portal for Managing Student Capstone Projects

A full-stack web application designed for universities to streamline the end-to-end process of managing capstone projects. It enables clients to propose projects, students to select preferences, and instructors to assign projects—all in one centralized platform.

Features

Student Portal: Browse projects, set preferences, view assigned projects.

Client Dashboard: Create and manage project proposals, review student interest.

Instructor Tools: Assign projects, manage evaluations, and oversee student progress.

Authentication: Secure login system using Firebase and JWT.

Admin Overview: View data across users, preferences, and project assignments.

Tech Stack

Frontend:

React.js

Tailwind CSS

Vite

Backend

Node.js

Express.js

MySQL

Authentication & Auth Management

Firebase Authentication (for secure sign-in)

JWT (for protected routes)

Installation

Prerequisites:

Node.js and npm

MySQL

Firebase project (for authentication)

Steps:

1.⁠ ⁠Clone the repository:

git clone https://github.com/your-username/capstone-portal.git

cd capstone-portal
2.⁠ ⁠Install dependencies:

frontend

cd frontend 

npm install
Backend:

cd ../backend

npm install
3.⁠ ⁠Configure environment variables:

Create a .env file in the backend directory and add your database and Firebase credentials.

Optionally configure Firebase settings in the frontend.

4.⁠ ⁠Run the project:

Backend:
npm start
Frontend:
cd ../frontend
npm run dev
Usage

Students sign up, browse available projects, and select up to 3 preferences.

Clients propose capstone projects and view student interest.

Instructors assign projects and monitor team composition.

API Documentation

Authentication

Register User

◦ Endpoint: POST /api/auth/register

◦ Description: Registers a new user.

◦ Request Body:

  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "securePassword",
    "role": "student"
  }
◦ Response:

  {
    "message": "User registered successfully",
    "token": "jwt-token"
  }
Login User

◦ Endpoint: POST /api/auth/login

◦ Description: Authenticates a user and returns a JWT token.

◦ Request Body:

{
  "email": "john.doe@example.com",
  "password": "securePassword"
}
◦ Response:

{
  "message": "Login successful",
  "token": "jwt-token"
}
Projects

Get All Projects

◦ Endpoint: POST /api/projects

◦ Description: Retrieves a list of all available projects.

◦ Headers:

Authorization: Bearer jwt-token
◦ Response:

[
  {
    "id": 1,
    "title": "AI Research",
    "client": "Tech Innovations Ltd.",
    "description": "Developing AI models for predictive analytics.",
    "skills": ["Machine Learning", "Python", "Data Analysis"]
  },
  ...
]
Create New Project

◦ Endpoint: POST /api/projects

◦ Description: Allows a client to propose a new project.

◦ Headers:

Authorization: Bearer jwt-token
◦ Request Body:

{
  "title": "AI Research",
  "description": "Developing AI models for predictive analytics.",
  "skills": ["Machine Learning", "Python", "Data Analysis"]
}
◦ Response:

{
  "message": "Project created successfully",
  "projectId": 1
}
Preferences

Submit Preferences

◦ Endpoint: POST /api/preferences

◦ Description: Allows a student to submit their project preferences.

◦ Headers:

Authorization: Bearer jwt-token
◦ Request Body:

{
  "preferences": [1, 2, 3]
}
◦ Response:

{
  "message": "Preferences submitted successfully"
}
Assignments

Assign Project to Student

◦ Endpoint: POST /api/assignments

◦ Description: Allows an instructor to assign a project to a student.

◦ Headers:

Authorization: Bearer jwt-token
◦ Request Body:

{
  "studentId": 5,
  "projectId": 1
}
◦ Response:

{
  "message": "Project assigned successfully"
}
Contributors

Sireesha Kuchimanchi

Sree Rama Vijay Tummalapalli

Gopi Krishna Nathani

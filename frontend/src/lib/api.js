// import axios from "axios";
// import { getAuth, onAuthStateChanged } from "firebase/auth";

// const api = axios.create({
//   baseURL: "http://localhost:5006",
// });

// api.interceptors.request.use(config => {
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//     config.headers["x-user-role"] = role;
//   }
//   return config;
// });

// export const fetchClientDashboardData = async () => {
//   const auth = getAuth();
//   const user = auth.currentUser;

//   if (!user) throw new Error("User not logged in");

//   const token = await user.getIdToken();

//   const clientId = JSON.parse(localStorage.getItem("user"))?.id;
//   const response = await fetch(`http://localhost:5006/api/projects/client/`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!response.ok) {
//     throw new Error("Failed to fetch dashboard data");
//   }

//   return await response.json();
// };

// export const fetchRecommendedProjects = async () => {
//   const res = await fetch("http://localhost:5006/api/projects/recommended");
//   if (!res.ok) throw new Error("Failed to fetch recommended projects");
//   return res.json();
// };

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5006",
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers["x-user-role"] = role;
  }
  return config;
});

export const fetchClientDashboardData = async () => {
  const response = await api.get("/api/projects/client"); // token handled by interceptor

  return {
    projects: response.data,
    tasks: [],
    events: [],
  };
};

export const fetchRecommendedProjects = async () => {
  const res = await api.get("/api/projects/recommended");
  return res.data;
};

export default api;

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

export const fetchClientDashboardData = () => api.get("/client/dashboard");

export const fetchRecommendedProjects = async () => {
  const res = await fetch("http://localhost:5006/api/projects/recommended");
  if (!res.ok) throw new Error("Failed to fetch recommended projects");
  return res.json();
};

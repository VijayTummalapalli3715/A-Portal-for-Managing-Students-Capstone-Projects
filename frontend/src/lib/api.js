import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5006", // your backend
  withCredentials: true,
});

export const fetchClientDashboardData = () => API.get("/client/dashboard");
export const fetchRecommendedProjects = () => API.get("/projects/recommended");

export default API;

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth
export const signup = (data) => API.post("/auth/signup", data);
export const login = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");

// Focus
export const createSession = (data) => API.post("/focus", data);
export const startSession = (id) => API.put(`/focus/${id}/start`);
export const pauseSession = (id) => API.put(`/focus/${id}/pause`);
export const resumeSession = (id) => API.put(`/focus/${id}/resume`);
export const endSession = (id, data) => API.put(`/focus/${id}/end`, data);
export const cancelSession = (id) => API.put(`/focus/${id}/cancel`);
export const getSessionHistory = () => API.get("/focus/history");
export const getUserStats = () => API.get("/focus/stats");
export const getAchievements = () => API.get("/focus/achievements");

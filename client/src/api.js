import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export const signup = (data) => API.post("/signup", data);
export const login = (data) => API.post("/login", data);
export const getMe = () => API.get("/me");

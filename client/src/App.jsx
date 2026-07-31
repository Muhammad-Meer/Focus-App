import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";

import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import FocusSession from "./components/FocusSession";
import SessionHistory from "./components/SessionHistory";

import "./styles/Navbar.css";
import "./styles/focus.css";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link to="/focus">🎯 Focus</Link>
        <Link to="/history">📊 History</Link>
        <Link to="/dashboard">📈 Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/focus" element={<FocusSession />} />
        <Route path="/history" element={<SessionHistory />} />
      </Routes>
    </BrowserRouter>
  );
}
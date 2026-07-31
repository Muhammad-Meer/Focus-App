import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="logo">
        🎯 FocusFlow
      </div>

      <div className="nav-links">
        <Link
          className={location.pathname === "/dashboard" ? "active" : ""}
          to="/dashboard"
        >
          Dashboard
        </Link>

        <Link
          className={location.pathname === "/focus" ? "active" : ""}
          to="/focus"
        >
          Focus
        </Link>

        <Link
          className={location.pathname === "/history" ? "active" : ""}
          to="/history"
        >
          History
        </Link>
      </div>
    </nav>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("user")) return navigate("/login");

    getMe()
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("user");
        navigate("/login");
      });
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome, {user.name}!</h2>
        <p>Email: {user.email}</p>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
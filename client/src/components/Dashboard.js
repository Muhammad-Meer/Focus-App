import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../api";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    getMe()
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("user");
        navigate("/login");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Welcome, {user.name}!</h2>
        <p>Email: {user.email}</p>
        <button onClick={handleLogout} style={styles.button}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f0f2f5",
  },
  card: {
    background: "white",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  button: {
    marginTop: "1rem",
    padding: "10px 20px",
    background: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default Dashboard;
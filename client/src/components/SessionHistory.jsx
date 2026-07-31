import { useEffect, useState } from "react";
import { getSessionHistory } from "../api";
import "../styles/focus.css";

export default function SessionHistory() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await getSessionHistory();
        setSessions(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="loading">Loading history...</div>;
  if (error) return <div className="error-center">{error}</div>;

  return (
    <div className="history-container">
      <h2>Session History</h2>

      {sessions.length === 0 ? (
        <p className="empty">No sessions yet. Start your first focus session!</p>
      ) : (
        <div className="history-list">
          {sessions.map((session) => (
            <div key={session._id} className="history-card">
              <div className="history-header">
                <h3>{session.title}</h3>
                <span className={`badge ${session.status}`}>{session.status}</span>
              </div>

              <div className="history-details">
                <p>Planned: <strong>{session.plannedDuration} min</strong></p>
                <p>Actual: <strong>{session.actualDuration} min</strong></p>
                <p>Date: {new Date(session.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
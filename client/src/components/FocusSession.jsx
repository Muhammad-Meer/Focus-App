import { useState, useEffect, useRef } from "react";
import {
  createSession,
  startSession,
  pauseSession,
  resumeSession,
  endSession,
  getSessionHistory,
  getUserStats,
} from "../api";
import "../styles/focus.css";

export default function FocusSession() {
  const [task, setTask] = useState("");
  const [duration, setDuration] = useState(25);
  const [session, setSession] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [reward, setReward] = useState(null);

  const timerRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }
    if (secondsLeft === 0 && isRunning) handleEnd();
    return () => clearInterval(timerRef.current);
  }, [isRunning, secondsLeft]);

  const loadData = async () => {
    try {
      const [hist, userStats] = await Promise.all([
        getSessionHistory(),
        getUserStats(),
      ]);
      setHistory(hist.data);
      setStats(userStats.data);
    } catch (err) {
      console.log(err);
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleStart = async (e) => {
    e.preventDefault();
    if (!task.trim()) return setError("Please write your focus task");

    setLoading(true);
    setError("");
    try {
      const { data: newSession } = await createSession({
        title: task,
        plannedDuration: duration,
      });
      const { data: started } = await startSession(newSession._id);
      setSession(started);
      setSecondsLeft(duration * 60);
      setIsRunning(true);
      setReward(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to start");
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async () => {
    const { data } = await pauseSession(session._id);
    setSession(data);
    setIsRunning(false);
  };

  const handleResume = async () => {
    const { data } = await resumeSession(session._id);
    setSession(data);
    setIsRunning(true);
  };

  const handleEnd = async () => {
    clearInterval(timerRef.current);
    try {
      const { data } = await endSession(session._id);
      setSession(data.session);
      setReward(data.rewards);
      setIsRunning(false);
      setSecondsLeft(0);
      loadData();
    } catch (err) {
      setError("Failed to end session");
    }
  };

  const handleNew = () => {
    setSession(null);
    setTask("");
    setDuration(25);
    setReward(null);
    setError("");
  };

  return (
    <div className="focus-app">
      {/* ===== STATS BAR ===== */}
      {stats && (
        <div className="stats-bar">
          <div className="stat">
            <span className="stat-value">{stats.points}</span>
            <span className="stat-label">Points</span>
          </div>
          <div className="stat">
            <span className="stat-value">{stats.currentStreak}</span>
            <span className="stat-label">Streak</span>
          </div>
          <div className="stat">
            <span className="stat-value">Lvl {stats.level}</span>
            <span className="stat-label">Level</span>
          </div>
          <div className="stat">
            <span className="stat-value">{stats.totalFocusMinutes}m</span>
            <span className="stat-label">Total Focus</span>
          </div>
        </div>
      )}

      {/* ===== MAIN CARD ===== */}
      <div className="focus-card">
        {!session || session.status === "completed" ? (
          <>
            <h1>Focus Mode</h1>
            <p className="subtitle">Protect your attention. Build better habits.</p>

            {error && <p className="error">{error}</p>}

            <form onSubmit={handleStart}>
              <div className="form-group">
                <label>What will you focus on?</label>
                <textarea
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="Example: 2 hours deep study / Finish React project / Read 40 pages..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Duration (minutes)</label>
                <div className="duration-options">
                  {[15, 25, 45, 60, 90].map((d) => (
                    <button
                      type="button"
                      key={d}
                      className={duration === d ? "active" : ""}
                      onClick={() => setDuration(d)}
                    >
                      {d}m
                    </button>
                  ))}
                </div>
              </div>

              <button className="btn-start" disabled={loading}>
                {loading ? "Starting..." : "Start Focus Session"}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="current-task">{session.title}</p>
            <div className={`timer ${session.status}`}>
              {formatTime(secondsLeft)}
            </div>
            <p className="status-text">
              {session.status === "running" ? "Focusing..." : "Paused"}
            </p>

            <div className="controls">
              {session.status === "running" && (
                <>
                  <button className="btn-pause" onClick={handlePause}>Pause</button>
                  <button className="btn-end" onClick={handleEnd}>End</button>
                </>
              )}
              {session.status === "paused" && (
                <>
                  <button className="btn-resume" onClick={handleResume}>Resume</button>
                  <button className="btn-end" onClick={handleEnd}>End</button>
                </>
              )}
            </div>
          </>
        )}

        {/* Reward Popup */}
        {reward && (
          <div className="reward-box">
            <h3>Session Complete!</h3>
            <p>+{reward.pointsEarned} Points</p>
            <p>Current Streak: {reward.currentStreak} days</p>
            <p>Level: {reward.level}</p>
            <button className="btn-start" onClick={handleNew}>
              Start New Session
            </button>
          </div>
        )}
      </div>

      {/* ===== HISTORY ===== */}
      <div className="history">
        <h2>Recent Sessions</h2>
        {history.length === 0 ? (
          <p className="empty">No sessions yet. Start your first focus!</p>
        ) : (
          history.slice(0, 8).map((item) => (
            <div key={item._id} className="history-item">
              <div>
                <strong>{item.title}</strong>
                <div className="meta">
                  {item.actualDuration} min • {item.pointsEarned || 0} pts •{" "}
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
              <span className={`badge ${item.status}`}>{item.status}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
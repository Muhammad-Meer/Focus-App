import { useState, useEffect, useRef } from "react";
import { createSession, startSession, pauseSession, resumeSession, endSession } from "../api";
import "../styles/focus.css";

export default function FocusSession() {
  const [title, setTitle] = useState("Deep Work");
  const [plannedDuration, setPlannedDuration] = useState(25);
  const [session, setSession] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const timerRef = useRef(null);

  // Timer logic
  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }

    if (secondsLeft === 0 && isRunning) {
      handleEnd();
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, secondsLeft]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await createSession({ title, plannedDuration });
      setSession(data);
      setSecondsLeft(plannedDuration * 60);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    try {
      const { data } = await startSession(session._id);
      setSession(data);
      setIsRunning(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to start");
    }
  };

  const handlePause = async () => {
    try {
      const { data } = await pauseSession(session._id);
      setSession(data);
      setIsRunning(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to pause");
    }
  };

  const handleResume = async () => {
    try {
      const { data } = await resumeSession(session._id);
      setSession(data);
      setIsRunning(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resume");
    }
  };

  const handleEnd = async () => {
    try {
      clearInterval(timerRef.current);
      const { data } = await endSession(session._id);
      setSession(data);
      setIsRunning(false);
      setSecondsLeft(0);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to end");
    }
  };

  const handleReset = () => {
    setSession(null);
    setSecondsLeft(0);
    setIsRunning(false);
    setTitle("Deep Work");
    setPlannedDuration(25);
    setError("");
  };

  // ====== CREATE FORM ======
  if (!session) {
    return (
      <div className="focus-container">
        <div className="focus-card">
          <h2>Create Focus Session</h2>
          {error && <p className="error">{error}</p>}

          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label>Session Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Deep Work"
                required
              />
            </div>

            <div className="form-group">
              <label>Duration (minutes)</label>
              <input
                type="number"
                value={plannedDuration}
                onChange={(e) => setPlannedDuration(Number(e.target.value))}
                min="1"
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create Session"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ====== ACTIVE SESSION ======
  return (
    <div className="focus-container">
      <div className="focus-card active-session">
        <h2>{session.title}</h2>
        <p className="status">Status: <span className={`badge ${session.status}`}>{session.status}</span></p>

        <div className="timer-display">
          {formatTime(secondsLeft)}
        </div>

        {error && <p className="error">{error}</p>}

        <div className="controls">
          {session.status === "created" && (
            <button className="btn-start" onClick={handleStart}>Start</button>
          )}

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

          {(session.status === "completed" || session.status === "cancelled") && (
            <div className="completed-info">
              <p>Actual Duration: <strong>{session.actualDuration} min</strong></p>
              <button className="btn-primary" onClick={handleReset}>New Session</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
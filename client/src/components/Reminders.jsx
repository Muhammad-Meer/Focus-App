import { useState, useEffect } from "react";
import { getUserStats } from "../api";
import "../styles/focus.css";

export default function Reminders() {
  const [stats, setStats] = useState(null);
  const [permission, setPermission] = useState(Notification.permission);
  const [reminderTime, setReminderTime] = useState(
    localStorage.getItem("dailyReminderTime") || "09:00"
  );
  const [showStreakWarning, setShowStreakWarning] = useState(false);

  useEffect(() => {
    loadStats();
    checkStreakStatus();
  }, []);

  const loadStats = async () => {
    try {
      const { data } = await getUserStats();
      setStats(data);
    } catch (err) {
      console.log(err);
    }
  };

  // Check if user has focused today or not
  const checkStreakStatus = async () => {
    try {
      const { data } = await getUserStats();
      if (!data.lastFocusDate) return;

      const lastFocus = new Date(data.lastFocusDate);
      const today = new Date();
      lastFocus.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      const diff = Math.floor((today - lastFocus) / (1000 * 60 * 60 * 24));

      // Agar kal focus kiya tha aur aaj nahi kiya → streak break hone wala hai
      if (diff === 1 && data.currentStreak > 0) {
        setShowStreakWarning(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Request notification permission
  const enableNotifications = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === "granted") {
      new Notification("Focus Mode", {
        body: "Daily reminders enabled! We'll remind you to focus.",
        icon: "/favicon.ico",
      });
    }
  };

  // Save reminder time
  const saveReminderTime = (time) => {
    setReminderTime(time);
    localStorage.setItem("dailyReminderTime", time);
  };

  // Simple daily reminder check (page open hone par)
  useEffect(() => {
    if (permission !== "granted") return;

    const now = new Date();
    const [hours, minutes] = reminderTime.split(":");
    const reminderDate = new Date();
    reminderDate.setHours(Number(hours), Number(minutes), 0);

    // Agar aaj reminder time nikal chuka hai aur aaj focus nahi hua
    if (now > reminderDate && stats && !hasFocusedToday(stats.lastFocusDate)) {
      new Notification("Time to Focus!", {
        body: "Aapne aaj abhi tak focus session nahi kiya. Chalo start karein!",
        icon: "/favicon.ico",
      });
    }
  }, [permission, stats]);

  const hasFocusedToday = (lastFocusDate) => {
    if (!lastFocusDate) return false;
    const last = new Date(lastFocusDate);
    const today = new Date();
    return (
      last.getDate() === today.getDate() &&
      last.getMonth() === today.getMonth() &&
      last.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="reminders-section">
      {/* ===== STREAK REMINDER ===== */}
      {showStreakWarning && (
        <div className="streak-warning">
          <span className="warning-icon">🔥</span>
          <div>
            <strong>Streak at Risk!</strong>
            <p>
              Your {stats?.currentStreak}-day streak will break if you don’t focus today.
            </p>
          </div>
          <button className="btn-small" onClick={() => setShowStreakWarning(false)}>
            Got it
          </button>
        </div>
      )}

      {/* ===== DAILY REMINDER SETTINGS ===== */}
      <div className="reminder-card">
        <h3>Daily Reminder</h3>
        <p className="reminder-desc">
          Get notified every day so you never break your focus habit.
        </p>

        {permission === "granted" ? (
          <div className="reminder-enabled">
            <p className="success-text">Notifications Enabled</p>
            <div className="time-picker">
              <label>Remind me at:</label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => saveReminderTime(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <button className="btn-reminder" onClick={enableNotifications}>
            Enable Daily Reminder
          </button>
        )}
      </div>
    </div>
  );
}
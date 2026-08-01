const FocusSession = require("../models/FocusSession");
const User = require("../models/User");

// Helper: Calculate points
const calculatePoints = (actualMinutes) => {
  // 1 minute = 2 points, bonus for longer sessions
  let points = actualMinutes * 2;
  if (actualMinutes >= 50) points += 20; // Deep work bonus
  if (actualMinutes >= 90) points += 30;
  return points;
};

// Helper: Update streak
const updateStreak = async (user) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastDate = user.lastFocusDate ? new Date(user.lastFocusDate) : null;
  if (lastDate) lastDate.setHours(0, 0, 0, 0);

  const diffDays = lastDate
    ? Math.floor((today - lastDate) / (1000 * 60 * 60 * 24))
    : null;

  if (diffDays === 0) {
    // Already focused today
    return;
  } else if (diffDays === 1) {
    user.currentStreak += 1;
  } else {
    user.currentStreak = 1;
  }

  if (user.currentStreak > user.longestStreak) {
    user.longestStreak = user.currentStreak;
  }

  user.lastFocusDate = new Date();
};

// ========== BADGE DEFINITIONS ==========
const BADGES = {
  first_session: {
    id: "first_session",
    name: "First Focus Session",
    description: "Completed your very first focus session",
  },
  streak_7: {
    id: "streak_7",
    name: "7-Day Streak",
    description: "Maintained focus for 7 consecutive days",
  },
  streak_30: {
    id: "streak_30",
    name: "30-Day Streak",
    description: "Maintained focus for 30 consecutive days",
  },
  hours_100: {
    id: "hours_100",
    name: "100 Hours Focus",
    description: "Accumulated 100 hours of deep focus",
  },
};

// Check & Award Badges
const checkAndAwardBadges = async (user) => {
  const earnedBadgeIds = user.badges.map((b) => b.id);
  const newlyEarned = [];

  if (!earnedBadgeIds.includes("first_session") && user.totalFocusMinutes > 0) {
    user.badges.push(BADGES.first_session);
    newlyEarned.push(BADGES.first_session);
  }

  if (!earnedBadgeIds.includes("streak_7") && user.currentStreak >= 7) {
    user.badges.push(BADGES.streak_7);
    newlyEarned.push(BADGES.streak_7);
  }

  if (!earnedBadgeIds.includes("streak_30") && user.currentStreak >= 30) {
    user.badges.push(BADGES.streak_30);
    newlyEarned.push(BADGES.streak_30);
  }

  if (!earnedBadgeIds.includes("hours_100") && user.totalFocusMinutes >= 6000) {
    user.badges.push(BADGES.hours_100);
    newlyEarned.push(BADGES.hours_100);
  }

  return newlyEarned;
};

// Create Session
const createSession = async (req, res) => {
  try {
    const { title, plannedDuration, category, mode } = req.body;

    if (!title || !plannedDuration) {
      return res.status(400).json({ message: "Task and duration are required" });
    }

    const session = await FocusSession.create({
      user: req.user.id,
      title,
      plannedDuration,
      category: category || "Coding",
      mode: mode || "pomodoro",
      status: "created",
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Start Session
const startSession = async (req, res) => {
  try {
    const session = await FocusSession.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!session) return res.status(404).json({ message: "Session not found" });
    if (session.status !== "created" && session.status !== "paused") {
      return res.status(400).json({ message: "Cannot start this session" });
    }

    session.status = "running";
    session.startTime = session.startTime || new Date();
    session.pausedAt = undefined;
    await session.save();

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Pause Session
const pauseSession = async (req, res) => {
  try {
    const session = await FocusSession.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!session) return res.status(404).json({ message: "Session not found" });
    if (session.status !== "running") {
      return res.status(400).json({ message: "Only running sessions can be paused" });
    }

    session.status = "paused";
    session.pausedAt = new Date();
    await session.save();

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Resume Session
const resumeSession = async (req, res) => {
  try {
    const session = await FocusSession.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!session) return res.status(404).json({ message: "Session not found" });
    if (session.status !== "paused") {
      return res.status(400).json({ message: "Only paused sessions can be resumed" });
    }

    if (session.pausedAt) {
      session.totalPausedTime += new Date() - session.pausedAt;
    }

    session.status = "running";
    session.pausedAt = undefined;
    await session.save();

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// End Session + Give Rewards
const endSession = async (req, res) => {
  try {
    const session = await FocusSession.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!session) return res.status(404).json({ message: "Session not found" });
    if (session.status === "completed") {
      return res.status(400).json({ message: "Session already completed" });
    }

    if (session.status === "paused" && session.pausedAt) {
      session.totalPausedTime += new Date() - session.pausedAt;
    }

    session.status = "completed";
    session.endTime = new Date();

    // The client timer is authoritative — accept a provided duration when given.
    if (typeof req.body.actualDuration === "number" && req.body.actualDuration > 0) {
      session.actualDuration = Math.round(req.body.actualDuration);
    } else if (session.startTime) {
      const totalMs = session.endTime - session.startTime - session.totalPausedTime;
      session.actualDuration = Math.max(0, Math.round(totalMs / 1000 / 60));
    } else {
      session.actualDuration = 0;
    }

    // Calculate points
    const points = calculatePoints(session.actualDuration);
    session.pointsEarned = points;
    await session.save();

    // Update User stats
    const user = await User.findById(req.user.id);
    user.totalFocusMinutes += session.actualDuration;
    user.points += points;

    // Level system (every 500 points = 1 level)
    user.level = Math.floor(user.points / 500) + 1;

    await updateStreak(user);

    // Check badges
    const newBadges = await checkAndAwardBadges(user);
    await user.save();

    res.json({
      session,
      rewards: {
        pointsEarned: points,
        totalPoints: user.points,
        currentStreak: user.currentStreak,
        level: user.level,
        newBadges, // newly earned badges
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Cancel Session (skipped/reset — no rewards, no streak change)
const cancelSession = async (req, res) => {
  try {
    const session = await FocusSession.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!session) return res.status(404).json({ message: "Session not found" });
    if (session.status === "completed") {
      return res.status(400).json({ message: "Session already completed" });
    }

    session.status = "cancelled";
    session.endTime = new Date();
    await session.save();

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// History
const getSessionHistory = async (req, res) => {
  try {
    const sessions = await FocusSession.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// User Stats (for dashboard)
const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name totalFocusMinutes points currentStreak longestStreak level lastFocusDate badges"
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createSession,
  startSession,
  pauseSession,
  resumeSession,
  endSession,
  cancelSession,
  getSessionHistory,
  getUserStats,
};

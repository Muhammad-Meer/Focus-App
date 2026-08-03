const FocusSession = require("../models/FocusSession");
const User = require("../models/User");
const Goal = require("../models/Goal");
const Notification = require("../models/Notification");

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
  night_owl: {
    id: "night_owl",
    name: "Night Owl",
    description: "Completed a focus session after 10:00 PM",
  },
  marathoner: {
    id: "marathoner",
    name: "Productivity Marathoner",
    description: "Completed 5 focus sessions within 24 hours",
  },
};

// Helper: Award a badge to a user if not already earned
const awardBadge = (user, badgeId, newlyEarned) => {
  const earnedBadgeIds = user.badges.map((b) => b.id);
  if (!earnedBadgeIds.includes(badgeId)) {
    user.badges.push(BADGES[badgeId]);
    newlyEarned.push(BADGES[badgeId]);
  }
};

// Check & Award Badges
const checkAndAwardBadges = async (user, session) => {
  const newlyEarned = [];

  if (user.totalFocusMinutes > 0) {
    awardBadge(user, "first_session", newlyEarned);
  }

  if (user.currentStreak >= 7) {
    awardBadge(user, "streak_7", newlyEarned);
  }

  if (user.currentStreak >= 30) {
    awardBadge(user, "streak_30", newlyEarned);
  }

  if (user.totalFocusMinutes >= 6000) {
    awardBadge(user, "hours_100", newlyEarned);
  }

  if (session && session.endTime && session.endTime.getHours() >= 22) {
    awardBadge(user, "night_owl", newlyEarned);
  }

  if (session) {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const sessionsToday = await FocusSession.countDocuments({
      user: user._id,
      status: "completed",
      endTime: { $gte: since },
    });
    if (sessionsToday >= 5) {
      awardBadge(user, "marathoner", newlyEarned);
    }
  }

  return newlyEarned;
};

// Helper: Create a notification
const createNotification = (userId, title, message, type = "system") => {
  return Notification.create({ user: userId, title, message, type });
};

// Helper: Advance goal progress from a completed session
const advanceGoals = async (userId, category, minutes) => {
  const goals = await Goal.find({
    user: userId,
    completed: false,
    $or: [{ category }, { category: "Daily" }],
  });

  for (const goal of goals) {
    goal.currentMinutes += minutes;
    if (goal.currentMinutes >= goal.targetMinutes) {
      goal.completed = true;
    }
    await goal.save();
  }
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
    const newBadges = await checkAndAwardBadges(user, session);
    await user.save();

    // Advance matching goals
    await advanceGoals(user._id, session.category, session.actualDuration);

    // Notifications
    const notifications = [];
    notifications.push(
      await createNotification(
        user._id,
        "Session Complete",
        `Logged ${session.actualDuration} min of ${session.category} focus: "${session.title}".`,
        "system"
      )
    );
    notifications.push(
      await createNotification(
        user._id,
        "Rewards Earned",
        `+${points} points • ${user.currentStreak}-day streak • Level ${user.level}`,
        "achievement"
      )
    );
    if (newBadges.length > 0) {
      notifications.push(
        await createNotification(
          user._id,
          "New Badge Unlocked",
          newBadges.map((b) => b.name).join(", "),
          "achievement"
        )
      );
    }

    res.json({
      session,
      rewards: {
        pointsEarned: points,
        totalPoints: user.points,
        currentStreak: user.currentStreak,
        level: user.level,
        newBadges,
      },
      notifications,
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

// Delete Session
const deleteSession = async (req, res) => {
  try {
    const session = await FocusSession.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!session) return res.status(404).json({ message: "Session not found" });

    await session.deleteOne();
    res.json({ message: "Session deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// History (completed sessions only)
const getSessionHistory = async (req, res) => {
  try {
    const sessions = await FocusSession.find({
      user: req.user.id,
      status: "completed",
    })
      .sort({ endTime: -1 })
      .limit(500);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// User Stats (for dashboard)
const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email totalFocusMinutes points currentStreak longestStreak level lastFocusDate badges"
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Achievement catalog computed from real user data
const getAchievements = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const sessions = await FocusSession.find({
      user: user._id,
      status: "completed",
    }).select("endTime");

    const totalSessions = sessions.length;
    const since24h = Date.now() - 24 * 60 * 60 * 1000;
    const nightSessions = sessions.filter(
      (s) => s.endTime && s.endTime.getHours() >= 22
    ).length;
    const sessions24h = sessions.filter(
      (s) => s.endTime && s.endTime.getTime() >= since24h
    ).length;

    const maxStreak = Math.max(user.longestStreak, user.currentStreak);
    const badgeMap = new Map(user.badges.map((b) => [b.id, b]));

    const clamp = (n) => Math.min(100, Math.max(0, Math.round(n)));

    const catalog = [
      {
        id: "first_session",
        title: "Deep Diver",
        description: "Complete your first continuous focus block.",
        iconName: "Zap",
        category: "mastery",
        progress: clamp((user.totalFocusMinutes / 50) * 100),
      },
      {
        id: "streak_7",
        title: "7-Day Flow Master",
        description: "Maintain a daily focus streak for 7 consecutive days.",
        iconName: "Flame",
        category: "streak",
        progress: clamp((maxStreak / 7) * 100),
      },
      {
        id: "streak_30",
        title: "Focus Conqueror",
        description: "Maintain a daily focus streak for 30 consecutive days.",
        iconName: "Crown",
        category: "streak",
        progress: clamp((maxStreak / 30) * 100),
      },
      {
        id: "hours_100",
        title: "Century Club",
        description: "Accumulate over 100 total hours of logged deep work.",
        iconName: "Trophy",
        category: "time",
        progress: clamp((user.totalFocusMinutes / 6000) * 100),
      },
      {
        id: "night_owl",
        title: "Night Owl",
        description: "Complete a focus session after 10:00 PM.",
        iconName: "Moon",
        category: "streak",
        progress: nightSessions > 0 ? 100 : 0,
      },
      {
        id: "marathoner",
        title: "Productivity Marathoner",
        description: "Log 5 focus sessions in a single 24-hour period.",
        iconName: "Award",
        category: "sessions",
        progress: clamp((sessions24h / 5) * 100),
      },
    ];

    const unlockedAt = (id) => {
      const badge = badgeMap.get(id);
      return badge && badge.earnedAt ? new Date(badge.earnedAt).toISOString().slice(0, 10) : undefined;
    };

    const result = catalog.map((ach) => ({
      ...ach,
      unlocked: badgeMap.has(ach.id),
      unlockedAt: unlockedAt(ach.id),
    }));

    res.json({ achievements: result, unlockedCount: user.badges.length, totalCount: catalog.length });
  } catch (error) {
    console.error(error);
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
  deleteSession,
  getSessionHistory,
  getUserStats,
  getAchievements,
};

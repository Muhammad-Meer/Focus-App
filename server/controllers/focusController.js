const FocusSession = require("../models/FocusSession");

// @desc    Create a new Focus Session
// @route   POST /api/focus
const createSession = async (req, res) => {
  try {
    const { title, plannedDuration } = req.body;

    if (!plannedDuration || plannedDuration < 1) {
      return res.status(400).json({ message: "Planned duration is required (min 1 minute)" });
    }

    const session = await FocusSession.create({
      user: req.user.id,
      title: title || "Focus Session",
      plannedDuration,
      status: "created",
    });

    res.status(201).json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Start a Focus Session
// @route   PUT /api/focus/:id/start
const startSession = async (req, res) => {
  try {
    const session = await FocusSession.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status !== "created" && session.status !== "paused") {
      return res.status(400).json({ message: "Session can only be started from created or paused state" });
    }

    session.status = "running";
    session.startTime = session.startTime || new Date();
    session.pausedAt = undefined;

    await session.save();
    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Pause a Focus Session
// @route   PUT /api/focus/:id/pause
const pauseSession = async (req, res) => {
  try {
    const session = await FocusSession.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status !== "running") {
      return res.status(400).json({ message: "Only running sessions can be paused" });
    }

    session.status = "paused";
    session.pausedAt = new Date();

    await session.save();
    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Resume a Focus Session
// @route   PUT /api/focus/:id/resume
const resumeSession = async (req, res) => {
  try {
    const session = await FocusSession.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status !== "paused") {
      return res.status(400).json({ message: "Only paused sessions can be resumed" });
    }

    // Calculate how long it was paused
    if (session.pausedAt) {
      const pausedDuration = new Date() - session.pausedAt;
      session.totalPausedTime += pausedDuration;
    }

    session.status = "running";
    session.pausedAt = undefined;

    await session.save();
    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    End a Focus Session
// @route   PUT /api/focus/:id/end
const endSession = async (req, res) => {
  try {
    const session = await FocusSession.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status === "completed" || session.status === "cancelled") {
      return res.status(400).json({ message: "Session already ended" });
    }

    // If currently paused, add the last pause duration
    if (session.status === "paused" && session.pausedAt) {
      const pausedDuration = new Date() - session.pausedAt;
      session.totalPausedTime += pausedDuration;
    }

    session.status = "completed";
    session.endTime = new Date();

    // Calculate actual focused time (in minutes)
    if (session.startTime) {
      const totalTime = session.endTime - session.startTime;
      const focusedTime = totalTime - session.totalPausedTime;
      session.actualDuration = Math.round(focusedTime / 1000 / 60); // minutes
    }

    await session.save();
    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get Session History
// @route   GET /api/focus/history
const getSessionHistory = async (req, res) => {
  try {
    const sessions = await FocusSession.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select("-__v");

    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get Single Session
// @route   GET /api/focus/:id
const getSession = async (req, res) => {
  try {
    const session = await FocusSession.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(session);
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
  getSessionHistory,
  getSession,
};
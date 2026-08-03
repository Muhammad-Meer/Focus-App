const express = require("express");
const router = express.Router();
const {
  createSession,
  startSession,
  pauseSession,
  resumeSession,
  endSession,
  cancelSession,
  getSessionHistory,
  getUserStats,
  getAchievements,
} = require("../controllers/focusController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.post("/", createSession);
router.get("/history", getSessionHistory);
router.get("/stats", getUserStats);
router.get("/achievements", getAchievements);
router.put("/:id/start", startSession);
router.put("/:id/pause", pauseSession);
router.put("/:id/resume", resumeSession);
router.put("/:id/end", endSession);
router.put("/:id/cancel", cancelSession);

module.exports = router;
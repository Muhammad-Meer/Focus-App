const mongoose = require("mongoose");

const focusSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "Coding",
    },
    mode: {
      type: String,
      enum: ["pomodoro", "shortBreak", "longBreak", "custom"],
      default: "pomodoro",
    },
    plannedDuration: {
      type: Number, // minutes
      required: true,
    },
    actualDuration: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["created", "running", "paused", "completed", "cancelled"],
      default: "created",
    },
    startTime: Date,
    endTime: Date,
    pausedAt: Date,
    totalPausedTime: {
      type: Number, // ms
      default: 0,
    },
    pointsEarned: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FocusSession", focusSessionSchema);
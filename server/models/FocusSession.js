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
      default: "Focus Session",
      trim: true,
    },
    plannedDuration: {
      type: Number, // minutes
      required: true,
      min: 1,
    },
    actualDuration: {
      type: Number, // minutes (calculated at the end)
      default: 0,
    },
    status: {
      type: String,
      enum: ["created", "running", "paused", "completed", "cancelled"],
      default: "created",
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    pausedAt: {
      type: Date,
    },
    totalPausedTime: {
      type: Number, // milliseconds
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FocusSession", focusSessionSchema);
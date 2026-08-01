const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },

    // Gamification
    totalFocusMinutes: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastFocusDate: { type: Date },
    level: { type: Number, default: 1 },

    // ===== BADGES =====
    badges: [
      {
        id: String,          // e.g. "first_session"
        name: String,        // e.g. "First Focus Session"
        description: String,
        earnedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
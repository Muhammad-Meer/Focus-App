const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    theme: { type: String, enum: ["light", "dark"], default: "light" },
    language: { type: String, default: "English (US)" },
    autoStartOnBoot: { type: Boolean, default: false },
    soundEnabled: { type: Boolean, default: true },
    soundVolume: { type: Number, default: 50, min: 0, max: 100 },
    ambientPreset: {
      type: String,
      enum: ["none", "rain", "binaural", "cafe", "space"],
      default: "none",
    },
    pomodoroDuration: { type: Number, default: 25, min: 1 },
    shortBreakDuration: { type: Number, default: 5, min: 1 },
    longBreakDuration: { type: Number, default: 15, min: 1 },
    customDuration: { type: Number, default: 45, min: 1 },
    autoStartBreaks: { type: Boolean, default: false },
    autoStartPomodoros: { type: Boolean, default: false },
    dailyGoalMinutes: { type: Number, default: 240, min: 1 },
    weeklyGoalMinutes: { type: Number, default: 1200, min: 1 },
  },
  { _id: false }
);

const subscriptionSchema = new mongoose.Schema(
  {
    plan: { type: String, enum: ["free", "pro"], default: "free" },
    price: { type: Number, default: 0 },
    renewsOn: { type: Date },
    cardLast4: { type: String },
    cardExpiry: { type: String },
  },
  { _id: false }
);

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

    settings: { type: settingsSchema, default: () => ({}) },
    subscription: { type: subscriptionSchema, default: () => ({}) },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
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
      required: true,
      default: "Coding",
    },
    targetMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    currentMinutes: {
      type: Number,
      default: 0,
    },
    deadline: {
      type: Date,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goal", goalSchema);

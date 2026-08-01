const express = require("express");
const cors = require("cors");
const focusRoutes = require("./routes/focus.route");
const connectDB = require('./config/db')

const authRoutes = require("./routes/auth.route");

const app = express();
connectDB()

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/focus", focusRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
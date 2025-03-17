require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const authRoutes = require("./routes/auth.route.js");
const projectRoutes = require("./routes/projects.route.js");
const taskRoutes = require("./routes/tasks.route.js");
const invitationRoutes = require("./routes/invitation.route.js");

const app = express();

// Connecting to the database
connectDB();

// Middleware to parse data from body
app.use(cors());
app.use(express.json());

// Routes Configuration
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/projects/:projectId/tasks", taskRoutes);
app.use("/api/projects/:projectId/invitations", invitationRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.route.js");
const projectRoutes = require("./routes/projects.route.js");
const taskRoutes = require("./routes/tasks.route.js");
const invitationRoutes = require("./routes/invitation.route.js");
const notificationRoutes = require("./routes/notification.route.js");
const activityRoutes = require("./routes/activity.route.js");
const commentRoutes = require("./routes/comment.route");
const userRoutes = require("./routes/user.route");
const uploadRoutes = require("./routes/uploads");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Connecting to the database
connectDB();

// CORS configuration for frontend with credentials
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes Configuration
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/projects/:projectId/tasks", taskRoutes);
app.use("/api/projects/:projectId/invitations", invitationRoutes);
app.use("/api/projects/:projectId/activity", activityRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api", commentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/uploads", uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

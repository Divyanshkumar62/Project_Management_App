require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
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
const templateRoutes = require("./routes/template.route");
const timeEntryRoutes = require("./routes/timeEntries.route");
const resourceRoutes = require("./routes/resource.route");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Connecting to the database
connectDB();

const allowedOrigins = [
  "http://localhost:5173", 
  "https://project-pilot-wine.vercel.app", // Vercel frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Static file serving for avatars (ad blocker compatible)
app.use('/avatars', express.static(path.join(__dirname, 'uploads/avatars')));

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
app.use("/api/templates", templateRoutes);
app.use("/api/time-entries", timeEntryRoutes);
app.use("/api/resources", resourceRoutes);

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

// Create HTTP server and Socket.IO server
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
  maxHttpBufferSize: 1e8,
});

// Store connected users with their socket IDs
const connectedUsers = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔗 New client connected:', socket.id);

  // Handle user authentication
  socket.on('authenticate', (userId) => {
    connectedUsers.set(userId, socket.id);
    socket.userId = userId;
    socket.join(userId); // Join user-specific room
    console.log(`✅ User ${userId} authenticated`);
  });

  // Handle joining project rooms
  socket.on('join_project', (projectId) => {
    socket.join(`project_${projectId}`);
    console.log(`👥 Socket ${socket.id} joined project ${projectId}`);
  });

  // Handle leaving project rooms
  socket.on('leave_project', (projectId) => {
    socket.leave(`project_${projectId}`);
    console.log(`👋 Socket ${socket.id} left project ${projectId}`);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    connectedUsers.delete(socket.userId);
    console.log('🚫 Client disconnected:', socket.id);
  });
});

// Make io instance available globally for controllers
global.io = io;

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔌 Socket.IO enabled`);
});

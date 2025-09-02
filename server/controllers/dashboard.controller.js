const Project = require("../models/Project");
const Task = require("../models/Task");
const Activity = require("../models/Activity");
const User = require("../models/User");

// GET /api/projects/:projectId/dashboard
const getProjectDashboard = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId).populate(
      "teamMembers.user",
      "name email role"
    );
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Project Info
    const projectInfo = {
      name: project.title,
      description: project.description,
      createdAt: project.createdAt,
    };

    // Task Stats
    const tasks = await Task.find({ project: projectId });
    const now = new Date();
    const taskStats = {
      total: tasks.length,
      completed: tasks.filter((t) => t.status === "Completed").length,
      inProgress: tasks.filter((t) => t.status === "In Progress").length,
      todo: tasks.filter((t) => t.status === "To Do").length,
      overdue: tasks.filter(
        (t) => t.dueDate && t.dueDate < now && t.status !== "Completed"
      ).length,
    };

    // Member Stats
    const totalMembers = project.teamMembers.length + 1; // +1 for owner
    const roles = { owner: 1, members: project.teamMembers.length };
    const memberStats = { totalMembers, roles };

    // Recent Activity
    const recentActivity = await Activity.find({ project: projectId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name");
    const recentActivityArr = recentActivity.map((a) => ({
      message: a.message,
      user: { name: a.user?.name || "User" },
      type: a.type,
      createdAt: a.createdAt,
    }));

    // Upcoming Deadlines
    const upcomingDeadlines = tasks
      .filter((t) => t.dueDate && t.status !== "Completed" && t.dueDate >= now)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 3)
      .map((t) => ({ title: t.title, dueDate: t.dueDate, status: t.status }));

    res.json({
      projectInfo,
      taskStats,
      memberStats,
      recentActivity: recentActivityArr,
      upcomingDeadlines,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};

module.exports = { getProjectDashboard };

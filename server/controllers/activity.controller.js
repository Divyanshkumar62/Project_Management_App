const Activity = require("../models/Activity");

// Helper to log activity efficiently;
async function logActivity(projectId, userId, type, message) {
  try {
    await Activity.create({ project: projectId, user: userId, type, message });
  } catch (err) {
    // Optionally log error, but don't block main flow
    console.error("Activity log error:", err.message);
  }
}

// GET /api/projects/:projectId/activity
async function getProjectActivities(req, res) {
  try {
    const { projectId } = req.params;
    const activities = await Activity.find({ project: projectId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch activity log" });
  }
}

module.exports = {
  logActivity,
  getProjectActivities,
};

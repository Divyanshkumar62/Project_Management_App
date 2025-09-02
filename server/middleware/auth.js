const jwt = require("jsonwebtoken");
const Project = require("../models/Project");

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("❌ No token provided in request.");
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token, Access Denied",
    });
    console.log("No token, Access Denied");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

// Role-based middleware
const requireRole = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const projectId = req.params.projectId || req.params.id;
      if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" });
      }

      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Check if user is the project creator (Owner)
      if (project.createdBy.toString() === req.user.id) {
        req.userRole = "Owner";
        return next();
      }

      // Check if user is a team member with the required role
      const member = project.teamMembers.find(
        (member) => member.user.toString() === req.user.id
      );

      if (!member) {
        return res.status(403).json({
          message: "You don't have access to this project",
        });
      }

      req.userRole = member.role;

      // Check if user has the required role
      if (requiredRole === "Owner" && member.role !== "Owner") {
        return res.status(403).json({
          message: "Owner role required for this action",
        });
      }

      next();
    } catch (error) {
      console.error("Role check error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};

// Helper function to get user role in a project
const getUserRole = async (userId, projectId) => {
  try {
    const project = await Project.findById(projectId);
    if (!project) return null;

    // Check if user is the project creator
    if (project.createdBy.toString() === userId) {
      return "Owner";
    }

    // Check if user is a team member
    const member = project.teamMembers.find(
      (member) => member.user.toString() === userId
    );

    return member ? member.role : null;
  } catch (error) {
    console.error("Get user role error:", error);
    return null;
  }
};

module.exports.requireRole = requireRole;
module.exports.getUserRole = getUserRole;

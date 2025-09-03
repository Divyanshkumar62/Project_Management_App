const express = require("express");
const router = express.Router();
const { check, body } = require("express-validator");
const auth = require("../middleware/auth");
const { requireRole } = require("../middleware/auth");

const {
  createProject,
  getProject,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectDashboard,
  renameProject,
  archiveProject,
  transferOwnership,
} = require("../controllers/project.controller.js");

router.post(
  "/",
  [
    auth,
    check("title", "Title is required").not().isEmpty(),
    check("description", "Description is required").not().isEmpty(),
    check("startDate", "Start Date is required").not().isEmpty(),
  ],
  createProject
);

// Project dashboard analytics/summary
router.get("/:projectId/dashboard", auth, getProjectDashboard);

// GET /api/projects?q=keyword&page=1&limit=10
// Supports search by name/description and pagination
router.get("/", auth, getProject);
router.get("/:id", auth, getProjectById);
router.put("/:id", [auth, requireRole("Owner")], updateProject);

// Project settings enhancements

router.put("/:projectId/rename", [auth, requireRole("Owner")], renameProject);
router.put("/:projectId/archive", [auth, requireRole("Owner")], archiveProject);
router.put(
  "/:projectId/transfer-ownership/:userId",
  [auth, requireRole("Owner")],
  transferOwnership
);
router.delete("/:id", [auth, requireRole("Owner")], deleteProject);

// Milestone routes
router.post('/:projectId/milestones', auth, [
  body('title').isLength({ min: 1, max: 100 }).trim(),
  body('description').optional().isLength({ max: 500 }).trim(),
  body('dueDate').isISO8601(),
  body('tasks').optional().isArray()
], (req, res) => res.status(501).json({ message: 'Milestone feature coming soon' }));

router.put('/:projectId/milestones/:milestoneId', auth, [
  body('status').isIn(['Pending', 'Completed', 'Overdue'])
], (req, res) => res.status(501).json({ message: 'Milestone feature coming soon' }));

module.exports = router;

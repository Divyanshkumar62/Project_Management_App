const express = require("express");
const router = express.Router({ mergeParams: true });
const { check } = require("express-validator");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/role");
const {
  getTaskById,
  updateTask,
  deleteTask,
  createTask,
  fetchUserTasks,
  fetchTasks,
} = require("../controllers/task.controller.js");

router.post(
  "/",
  [
    auth,
    check("title", "Title is required").not().isEmpty(),

  ],
  createTask
);

router.get("/user", auth, fetchUserTasks);
// GET /api/projects/:projectId/tasks?status=todo|in-progress|done&priority=low|medium|high&assignee=userId&dueBefore=YYYY-MM-DD&q=keyword&page=1&limit=10
// Supports filtering, search, and pagination
router.get("/", auth, fetchTasks);
router.get("/:taskId", auth, getTaskById);
router.put("/:taskId", [auth, checkRole(["Admin", "Manager"])], updateTask);
router.delete("/:taskId", [auth, checkRole(["Admin", "Manager"])], deleteTask);

module.exports = router;

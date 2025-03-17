const express = require("express");
const router = express.Router({ mergeParams: true });
const { check } = require("express-validator");
const auth = require("../middleware/auth");
const checkRole = require('../middleware/role')
const {
  getTask,
  getTaskById,
  updateTask,
  deleteTask,
  createTask,
  getUserTasks,
} = require("../controllers/task.controller.js");

router.post(
  "/",
  [
    auth,
    check("title", "Title is required").not().isEmpty(),
    check("assignedTo", "Assigned to is required").not().isEmpty(),
  ],
  createTask
);

router.get("/user", auth, getUserTasks);
router.get("/", auth, getTask);
router.get("/:taskId", auth, getTaskById);
router.put("/:taskId", [ auth, checkRole(["Admin", "Manager"]) ], updateTask);
router.delete("/:taskId", [ auth, checkRole(["Admin", "Manager"]) ], deleteTask);

module.exports = router;

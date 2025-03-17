const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const auth = require("../middleware/auth");
const checkRole = require('../middleware/role')
const {
  createProject,
  getProject,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/project.controller.js");

router.post(
  "/",
  [
    auth,
    checkRole(['Admin', 'Manager']),
    check("title", "Title is required").not().isEmpty(),
    check("description", "Description is required").not().isEmpty(),
    check("startDate", "Start Date is required").not().isEmpty(),
  ],
  createProject
);

router.get("/", auth, getProject);
router.get("/:id", auth, getProjectById);
router.put("/:id", [ auth, checkRole(["Admin", "Manager"]) ], updateProject);
router.delete("/:id", [ auth, checkRole(["Admin", "Manager"]) ], deleteProject);

module.exports = router;

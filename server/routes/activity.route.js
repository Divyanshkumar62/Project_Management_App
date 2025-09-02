const express = require("express");
const router = express.Router({ mergeParams: true });
const { getProjectActivities } = require("../controllers/activity.controller");
const auth = require("../middleware/auth");

// GET /api/projects/:projectId/activity
router.get("/", auth, getProjectActivities);

module.exports = router;

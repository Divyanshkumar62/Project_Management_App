const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const uploadController = require("../controllers/uploadController");

// Upload attachment to task
router.post(
  "/projects/:projectId/tasks/:taskId/attachments",
  auth,
  uploadController.uploadTaskAttachment
);
// Upload attachment to comment
router.post(
  "/projects/:projectId/comments/:commentId/attachments",
  auth,
  uploadController.uploadCommentAttachment
);
// Delete attachment
router.delete(
  "/attachments/:attachmentId",
  auth,
  uploadController.deleteAttachment
);

module.exports = router;

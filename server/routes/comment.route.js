const express = require("express");
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const commentController = require("../controllers/comment.controller");

const router = express.Router();

router.get("/tasks/:taskId/comments", auth, commentController.listComments);
router.post(
  "/tasks/:taskId/comments",
  auth,
  [
    body("content").isLength({ min: 1, max: 5000 }).trim(),
    body("mentions").optional().isArray(),
  ],
  commentController.createComment
);
router.put(
  "/comments/:commentId",
  auth,
  [
    body("content").isLength({ min: 1, max: 5000 }).trim(),
    body("mentions").optional().isArray(),
  ],
  commentController.updateComment
);
router.delete("/comments/:commentId", auth, commentController.deleteComment);

module.exports = router;

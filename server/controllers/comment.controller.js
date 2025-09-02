const { validationResult } = require("express-validator");
const Comment = require("../models/Comment");
const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");
const { sanitizeMarkdown } = require("../utils/sanitize");
const { isProjectMember, isProjectOwner } = require("../utils/rbac");
const { rateLimitCheck } = require("../utils/rateLimit");

// Service functions for testability
async function getTaskAndProject(taskId) {
  const task = await Task.findById(taskId).populate("project");
  if (!task) throw { message: "Task not found" };
  return { task, project: task.project };
}

const listComments = async (req, res) => {
  try {
    const { taskId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const { task, project } = await getTaskAndProject(taskId);
    if (!isProjectMember(req.user.id, project))
      return res.status(403).json({ message: "Not authorized" });
    const comments = await Comment.find({ task: taskId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("author", "_id name avatarUrl")
      .lean();
    res.json({ comments, page, limit });
  } catch (err) {
    res.status(400).json({ message: err.message || "Error listing comments" });
  }
};

const createComment = async (req, res) => {
  try {
    if (!rateLimitCheck(req.user.id, "comment_create"))
      return res.status(429).json({ message: "Rate limit exceeded" });
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(400)
        .json({ message: "Validation error", details: errors.array() });
    const { taskId } = req.params;
    const { content, mentions = [] } = req.body;
    const { task, project } = await getTaskAndProject(taskId);
    if (!isProjectMember(req.user.id, project))
      return res.status(403).json({ message: "Not authorized" });
    // Validate mentions
    for (const userId of mentions) {
      if (!isProjectMember(userId, project))
        return res
          .status(400)
          .json({ message: "Mentioned user not in project" });
    }
    const sanitizedContent = sanitizeMarkdown(content);
    const comment = await Comment.create({
      task: taskId,
      project: project._id,
      author: req.user.id,
      content: sanitizedContent,
      mentions,
    });
    await comment.populate("author", "_id name avatarUrl");
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ message: err.message || "Error creating comment" });
  }
};

const updateComment = async (req, res) => {
  try {
    if (!rateLimitCheck(req.user.id, "comment_update"))
      return res.status(429).json({ message: "Rate limit exceeded" });
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(400)
        .json({ message: "Validation error", details: errors.array() });
    const { commentId } = req.params;
    const { content, mentions = [] } = req.body;
    const comment = await Comment.findById(commentId).populate("project");
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    const isAuthor = comment.author.toString() === req.user.id;
    const isOwner = isProjectOwner(req.user.id, comment.project);
    if (!isAuthor && !isOwner)
      return res.status(403).json({ message: "Not authorized" });
    for (const userId of mentions) {
      if (!isProjectMember(userId, comment.project))
        return res
          .status(400)
          .json({ message: "Mentioned user not in project" });
    }
    comment.content = sanitizeMarkdown(content);
    comment.mentions = mentions;
    comment.isEdited = true;
    await comment.save();
    await comment.populate("author", "_id name avatarUrl");
    res.json(comment);
  } catch (err) {
    res.status(400).json({ message: err.message || "Error updating comment" });
  }
};

const deleteComment = async (req, res) => {
  try {
    if (!rateLimitCheck(req.user.id, "comment_delete"))
      return res.status(429).json({ message: "Rate limit exceeded" });
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId).populate("project");
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    const isAuthor = comment.author.toString() === req.user.id;
    const isOwner = isProjectOwner(req.user.id, comment.project);
    if (!isAuthor && !isOwner)
      return res.status(403).json({ message: "Not authorized" });
    comment.isDeleted = true;
    comment.content = "[deleted]";
    await comment.save();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message || "Error deleting comment" });
  }
};

// Exporting the functions at the bottom of the file
module.exports = {
  listComments,
  createComment,
  updateComment,
  deleteComment,
};

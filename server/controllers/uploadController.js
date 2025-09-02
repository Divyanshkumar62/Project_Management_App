const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Task = require("../models/Task");
const Comment = require("../models/Comment");
const Project = require("../models/Project");
const { validationResult } = require("express-validator");

const UPLOAD_DIR =
  process.env.UPLOAD_DIR || path.join(__dirname, "../../uploads");

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
}).single("file");

const uploadTaskAttachment = (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    try {
      const task = await Task.findById(req.params.taskId);
      if (!task) return res.status(404).json({ error: "Task not found" });
      
      const attachment = {
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`,
        uploadedBy: req.user.id,
        createdAt: new Date(),
      };
      
      task.attachments.push(attachment);
      await task.save();
      res.status(201).json(attachment);
    } catch (e) {
      console.error("Upload task attachment error:", e);
      res.status(500).json({ error: "Server error" });
    }
  });
};

const uploadCommentAttachment = (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    try {
      const comment = await Comment.findById(req.params.commentId);
      if (!comment) return res.status(404).json({ error: "Comment not found" });
      
      const attachment = {
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`,
        uploadedBy: req.user.id,
        createdAt: new Date(),
      };
      
      comment.attachments.push(attachment);
      await comment.save();
      res.status(201).json(attachment);
    } catch (e) {
      console.error("Upload comment attachment error:", e);
      res.status(500).json({ error: "Server error" });
    }
  });
};

const deleteAttachment = async (req, res) => {
  try {
    // Find and remove from Task
    const task = await Task.findOne({
      "attachments._id": req.params.attachmentId,
    });
    
    if (task) {
      const att = task.attachments.id(req.params.attachmentId);
      if (!att) return res.status(404).json({ error: "Attachment not found" });
      
      // Only uploader or project owner can delete
      if (att.uploadedBy.toString() !== req.user.id) {
        // Check if user is project owner
        const project = await Project.findById(task.project);
        if (!project || project.createdBy.toString() !== req.user.id) {
          return res.status(403).json({ error: "Not authorized" });
        }
      }
      
      // Delete file from filesystem
      const filePath = path.join(UPLOAD_DIR, att.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      att.remove();
      await task.save();
      return res.json({ success: true });
    }
    
    // Find and remove from Comment
    const comment = await Comment.findOne({
      "attachments._id": req.params.attachmentId,
    });
    
    if (comment) {
      const att = comment.attachments.id(req.params.attachmentId);
      if (!att) return res.status(404).json({ error: "Attachment not found" });
      
      if (att.uploadedBy.toString() !== req.user.id) {
        return res.status(403).json({ error: "Not authorized" });
      }
      
      // Delete file from filesystem
      const filePath = path.join(UPLOAD_DIR, att.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      att.remove();
      await comment.save();
      return res.json({ success: true });
    }
    
    res.status(404).json({ error: "Attachment not found" });
  } catch (e) {
    console.error("Delete attachment error:", e);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  uploadTaskAttachment,
  uploadCommentAttachment,
  deleteAttachment,
};

const { validationResult } = require("express-validator");
const Task = require("../models/Task");
const Project = require("../models/Project");

const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });
  const { title, description, dueDate, priority, assignedTo } = req.body;

  try {
    let project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ err: "Project not found!" });
    }
    if (
      project.createdBy.toString() !== req.user.id &&
      !project.teamMembers.includes(req.user.id)
    ) {
      return res.status(403).json({
        msg: "Not authorized to add task to this project!",
      });
    }
    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      assignedTo: assignedTo ? [].concat(assignedTo) : [],
      project: req.params.projectId,
    });
    await task.save();

    project.tasks.push(task._id);
    await project.save();
    console.log(project)
    res.status(201).json(task);
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Internal Server Error!");
  }
};

const getTask = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({
        err: "Project not found!",
      });
    }
    if (
      project.createdBy.toString() !== req.user.id &&
      !project.teamMembers.includes(req.user.id)
    ) {
      return res.status(403).json({
        msg: "Not authorized to view tasks for this project!",
      });
    }
    const tasks = await Task.find({ project: req.params.projectId });
    res.status(200).json(tasks);
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Internal Server Error!");
  }
};

const getUserTasks = async (req, res) => {
  try {
    const userId = req.user.id; // Get logged-in user ID
    console.log("🟢 Logged-in User ID:", userId);

    const tasks = await Task.find({ assignedTo: userId }).populate("project"); // Fetch only the logged-in user's tasks

    console.log("🟢 Tasks Found:", tasks);

    if (!tasks.length) {
      return res.status(404).json({ message: "No tasks assigned to you." }); 
    }

    res.status(200).json(tasks);
  } catch (err) {
    console.error("❌ Error fetching user tasks:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const getTaskById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({
        err: "Project not found!",
      });
    }
    if (
      project.createdBy.toString() !== req.user.id &&
      !project.teamMembers.includes(req.user.id)
    ) {
      return res.status(403).json({
        msg: "Not authorized to view tasks for this project!",
      });
    }
    const tasks = await Task.findById(req.params.taskId);
    if (!tasks) {
      return res.status(404).json({ msg: "Task not Found!" });
    }
    res.status(200).json(tasks);
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Internal Server Error!");
  }
};

const updateTask = async (req, res) => {
  const { title, description, dueDate, status, priority, assignedTo } =
    req.body;
  const taskFields = {};
  if (title) taskFields.title = title;
  if (description) taskFields.description = description;
  if (dueDate) taskFields.dueDate = dueDate;
  if (status) taskFields.status = status;
  if (priority) taskFields.priority = priority;
  if (assignedTo) taskFields.assignedTo = assignedTo;
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({
        err: "Project not found!",
      });
    }
    if (
      project.createdBy.toString() !== req.user.id &&
      !project.teamMembers.includes(req.user.id)
    ) {
      return res.status(403).json({
        msg: "Not authorized to view tasks for this project!",
      });
    }
    let task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ msg: "Task not Found!" });
    }
    task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { $set: taskFields },
      { new: true }
    );
    res.status(200).json(task);
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Internal Server Error!");
  }
};

const deleteTask = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({
        err: "Project not found!",
      });
    }
    if (
      project.createdBy.toString() !== req.user.id &&
      !project.teamMembers.includes(req.user.id)
    ) {
      return res.status(403).json({
        msg: "Not authorized to delete tasks in this project!",
      });
    }
    let task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ msg: "Task not Found!" });
    }
    await task.remove();
    res.status(200).json({ msg: "Task Deleted!" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Internal Server Error!");
  }
};

module.exports = {
  createTask,
  getTask,
  getTaskById,
  updateTask,
  deleteTask,
  getUserTasks,
};

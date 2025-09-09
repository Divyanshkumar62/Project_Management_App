const TimeEntry = require('../models/TimeEntry');
const Task = require('../models/Task');
const Project = require('../models/Project');

// Get time entries for a task
const getTaskTimeEntries = async (req, res) => {
  try {
    const { taskId } = req.params;
    const timeEntries = await TimeEntry.find({ task: taskId })
      .populate('user', 'name')
      .sort({ startTime: -1 });

    res.json(timeEntries);
  } catch (error) {
    console.error('Get task time entries error:', error);
    res.status(500).json({ message: 'Error retrieving time entries' });
  }
};

// Get time entries for a project
const getProjectTimeEntries = async (req, res) => {
  try {
    const { projectId } = req.params;
    const timeEntries = await TimeEntry.find({ project: projectId })
      .populate('user', 'name')
      .populate('task', 'title')
      .sort({ startTime: -1 });

    res.json(timeEntries);
  } catch (error) {
    console.error('Get project time entries error:', error);
    res.status(500).json({ message: 'Error retrieving time entries' });
  }
};

// Start time tracking for a task
const startTimeTracking = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { description } = req.body;

    // Check if there's an already running timer
    const existingRunning = await TimeEntry.findOne({
      user: req.user.id,
      task: taskId,
      isRunning: true
    });

    if (existingRunning) {
      return res.status(400).json({
        message: 'You already have a running timer for this task'
      });
    }

    // Get task and project info
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check user permission (must be team member)
    const project = await Project.findById(task.project);
    const isMember = project.teamMembers.some(member =>
      member.user.toString() === req.user.id
    );

    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const timeEntry = new TimeEntry({
      task: taskId,
      user: req.user.id,
      project: task.project,
      description: description || '',
      startTime: new Date(),
      isRunning: true
    });

    await timeEntry.save();
    await timeEntry.populate('user', 'name');

    res.status(201).json(timeEntry);
  } catch (error) {
    console.error('Start time tracking error:', error);
    res.status(500).json({ message: 'Error starting time tracking' });
  }
};

// Stop time tracking for a task
const stopTimeTracking = async (req, res) => {
  try {
    const { taskId } = req.params;

    const timeEntry = await TimeEntry.findOne({
      user: req.user.id,
      task: taskId,
      isRunning: true
    });

    if (!timeEntry) {
      return res.status(404).json({ message: 'No running timer found for this task' });
    }

    timeEntry.endTime = new Date();
    await timeEntry.save();
    await timeEntry.populate('user', 'name');

    res.json(timeEntry);
  } catch (error) {
    console.error('Stop time tracking error:', error);
    res.status(500).json({ message: 'Error stopping time tracking' });
  }
};

// Get current running timer for user
const getCurrentTimer = async (req, res) => {
  try {
    const timeEntry = await TimeEntry.findOne({
      user: req.user.id,
      isRunning: true
    }).populate('task', 'title project')
      .populate('project', 'title');

    if (!timeEntry) {
      return res.json(null);
    }

    res.json(timeEntry);
  } catch (error) {
    console.error('Get current timer error:', error);
    res.status(500).json({ message: 'Error retrieving current timer' });
  }
};

// Update time entry
const updateTimeEntry = async (req, res) => {
  try {
    const { entryId } = req.params;
    const { description, startTime, endTime } = req.body;

    const timeEntry = await TimeEntry.findById(entryId);
    if (!timeEntry) {
      return res.status(404).json({ message: 'Time entry not found' });
    }

    // Only allow user to update their own entries
    if (timeEntry.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (description !== undefined) timeEntry.description = description;
    if (startTime) timeEntry.startTime = new Date(startTime);
    if (endTime) {
      timeEntry.endTime = new Date(endTime);
      timeEntry.isRunning = false;
    }

    await timeEntry.save();
    await timeEntry.populate('user', 'name');

    res.json(timeEntry);
  } catch (error) {
    console.error('Update time entry error:', error);
    res.status(500).json({ message: 'Error updating time entry' });
  }
};

// Delete time entry
const deleteTimeEntry = async (req, res) => {
  try {
    const { entryId } = req.params;

    const timeEntry = await TimeEntry.findById(entryId);
    if (!timeEntry) {
      return res.status(404).json({ message: 'Time entry not found' });
    }

    // Only allow user to delete their own entries
    if (timeEntry.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await TimeEntry.findByIdAndDelete(entryId);
    res.json({ message: 'Time entry deleted successfully' });
  } catch (error) {
    console.error('Delete time entry error:', error);
    res.status(500).json({ message: 'Error deleting time entry' });
  }
};

module.exports = {
  getTaskTimeEntries,
  getProjectTimeEntries,
  startTimeTracking,
  stopTimeTracking,
  getCurrentTimer,
  updateTimeEntry,
  deleteTimeEntry
};

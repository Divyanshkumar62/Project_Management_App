const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');
const auth = require('../middleware/auth');
const timeEntryController = require('../controllers/timeEntry.controller');

// Get current running timer for user
router.get('/current', auth, timeEntryController.getCurrentTimer);

// Task-specific time entries
router.get('/task/:taskId', auth, timeEntryController.getTaskTimeEntries);

// Project-specific time entries
router.get('/project/:projectId', auth, timeEntryController.getProjectTimeEntries);

// Start time tracking for a task
router.post('/task/:taskId/start', [
  auth,
  body('description').optional().isLength({ max: 500 }).trim()
], timeEntryController.startTimeTracking);

// Stop time tracking for a task
router.post('/task/:taskId/stop', auth, timeEntryController.stopTimeTracking);

// Update time entry
router.put('/:entryId', [
  auth,
  body('description').optional().isLength({ max: 500 }).trim(),
  body('startTime').optional().isISO8601(),
  body('endTime').optional().isISO8601()
], timeEntryController.updateTimeEntry);

// Delete time entry
router.delete('/:entryId', auth, timeEntryController.deleteTimeEntry);

module.exports = router;

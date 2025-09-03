const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const templateController = require('../controllers/template.controller');

const router = express.Router();

// Get all templates
router.get('/', auth, templateController.getTemplates);

// Create template
router.post('/', auth, [
  body('name').isLength({ min: 1, max: 100 }).trim(),
  body('description').isLength({ min: 1, max: 500 }).trim(),
  body('category').isIn(['Software', 'Marketing', 'Design', 'Research', 'Operations', 'Other']),
  body('defaultDuration').isInt({ min: 1, max: 365 }),
  body('tasks').isArray({ min: 1 }),
  body('tasks.*.title').isLength({ min: 1, max: 100 }).trim(),
  body('tasks.*.priority').optional().isIn(['Low', 'Medium', 'High'])
], templateController.createTemplate);

// Create project from template
router.post('/:templateId/create-project', auth, [
  body('title').isLength({ min: 1, max: 100 }).trim(),
  body('description').isLength({ min: 1, max: 1000 }).trim(),
  body('startDate').isISO8601(),
  body('endDate').optional().isISO8601()
], templateController.createProjectFromTemplate);

// Delete template
router.delete('/:id', auth, templateController.deleteTemplate);

module.exports = router;

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const resourceController = require('../controllers/resource.controller');

// User resource profile routes
router.get('/profile', auth, resourceController.getUserResource);
router.put('/profile', auth, [
  body('capacity').optional().isInt({ min: 1, max: 80 }),
  body('skills').optional().isArray()
], resourceController.updateUserResource);

// Availability management
router.put('/availability', auth, [
  body('date').isISO8601(),
  body('available').isBoolean(),
  body('reason').optional().isIn(['Vacation', 'Sick Leave', 'Training', 'Meeting', 'Other']),
  body('notes').optional().isString()
], resourceController.updateAvailability);

module.exports = router;

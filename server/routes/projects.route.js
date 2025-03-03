const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth')

router.post('/', [
    auth,
    check('title','Title is required').not().isEmpty(),
    check('description','Description is required').not().isEmpty(),
    check('startDate','Start Date is required').not().isEmpty(),
], createProject)

router.get('/', auth, getProject)
router.get('/:id', auth, getProjectById)
router.put('/:id', auth, updateProject)
router.delete('/:id', auth, deleteProject)

module.exports = router;
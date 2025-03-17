const express = require('express');
const router = express.Router({ mergeParams: true });
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/role')
const { sendInvitation, getInvitations, acceptInvitation, declineInvitation } = require('../controllers/invitation.controller.js');

router.post('/', [
    auth,
    checkRole(['Admin', 'Manager']),
    check("invitedEmail", "Please enter a valid email").isEmail(),
], sendInvitation);

router.get('/', [ auth, checkRole(['Admin', 'Manager']) ], getInvitations);
router.put('/:invitationId/accept', auth, acceptInvitation);
router.put('/:invitationId/decline', auth, declineInvitation)

module.exports = router;
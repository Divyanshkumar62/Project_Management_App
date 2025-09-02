const express = require("express");
const router = express.Router({ mergeParams: true });
const { check } = require("express-validator");
const auth = require("../middleware/auth");
const { requireRole } = require("../middleware/auth");
const {
  sendInvitation,
  getInvitations,
  acceptInvitation,
  declineInvitation,
} = require("../controllers/invitation.controller.js");

router.post(
  "/",
  [
    auth,
    requireRole("Owner"),
    check("invitedEmail", "Please enter a valid email").isEmail(),
  ],
  sendInvitation
);

router.get("/", [auth, requireRole("Owner")], getInvitations);
router.put("/:invitationId/accept", auth, acceptInvitation);
router.put("/:invitationId/decline", auth, declineInvitation);

module.exports = router;

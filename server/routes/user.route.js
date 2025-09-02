const express = require("express");
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const userController = require("../controllers/user.controller");
const { uploadAvatar } = require("../utils/upload");

const router = express.Router();

router.get("/me", auth, userController.getMe);
router.put(
  "/me",
  auth,
  [
    body("name").optional().isLength({ min: 1, max: 100 }),
    body("bio").optional().isLength({ max: 500 }),
    body("timezone").optional().isString(),
    body("notificationPrefs").optional().isObject(),
  ],
  userController.updateMe
);
router.put(
  "/me/password",
  auth,
  [
    body("currentPassword").isLength({ min: 6 }),
    body("newPassword").isLength({ min: 8 }),
  ],
  userController.updatePassword 
);
router.put(
  "/me/avatar",
  auth,
  uploadAvatar.single("avatar"),
  userController.updateAvatar
);
router.get("/:userId", userController.getPublicProfile);

module.exports = router;

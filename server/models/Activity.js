const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: [
      "PROJECT_CREATED",
      "INVITE_SENT",
      "INVITE_ACCEPTED",
      "TASK_CREATED",
      "TASK_UPDATED",
      "TASK_DELETED",
      "ROLE_UPDATED",
    ],
    required: true,
  },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Activity", activitySchema);

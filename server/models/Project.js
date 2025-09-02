const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teamMembers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["Owner", "Member"],
          default: "Member",
        },
      },
    ],
    status: {
      type: String,
      enum: ["Active", "Completed", "Planning", "Archived"],
      default: "Planning",
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes for performance
projectSchema.index({ title: "text", description: "text" });
projectSchema.index({ createdBy: 1 });
projectSchema.index({ "teamMembers.user": 1 });
module.exports = mongoose.model("Project", projectSchema);

const mongoose = require('mongoose')

const invitationSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    invitedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    invitedEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    role: {
        type: String,
        enum: ["Manager", "TeamMember"],
        default: "TeamMember",
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Declined"],
        default: "Pending"
    }
}, {timestamps: true})

module.exports = mongoose.model("Invitation", invitationSchema)
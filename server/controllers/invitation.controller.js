const { validationResult } = require("express-validator");
const Invitation = require("../models/Invitation");
const Project = require("../models/Project");
const User = require("../models/User");

const { sendEmail } = require("../utils/mailer");
const { createNotification } = require("./notification.controller");
const { logActivity } = require("./activity.controller");

const sendInvitation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({
      errors: errors.array(),
    });
  }
  try {
    const { invitedEmail, role } = req.body;
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({
        msg: "Project not found!",
      });
    }
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(400).json({
        msg: "You are not authorized to send invitations for this project!",
      });
    }
    const existingInvitation = await Invitation.findOne({
      project: project._id,
      invitedEmail: invitedEmail.toLowerCase(),
      status: "Pending",
    });
    if (existingInvitation) {
      return res.status(404).json({
        msg: "An Invitation is already pending for this email!",
      });
    }
    const invitation = new Invitation({
      project: project._id,
      invitedBy: req.user.id,
      invitedEmail: invitedEmail.toLowerCase(),
      role: role || "TeamMember",
    });

    await invitation.save();
    // Create notification for invited user
    const invitedUser = await User.findOne({
      email: invitedEmail.toLowerCase(),
    });
    if (invitedUser) {
      await createNotification({
        user: invitedUser._id,
        type: "INVITATION",
        message: `You have been invited to join project '${project.title}' as ${invitation.role}.`,
        project: project._id,
      });
    }

    // Email handler configuration
    const emailContent = `
      <h2>You have a new project invitation!</h2>
      <p>You have been invited to join the project <strong>${project.title} as a ${invitation.role}.</strong></p>
      <p>Please log in to your account to accept or decline this invitation.</p>
    `;
    await sendEmail({
      to: invitation.invitedEmail,
      subject: "New Project Invitation",
      html: emailContent,
    });

    // Log activity: invitation sent
    await logActivity(
      project._id,
      req.user.id,
      "INVITE_SENT",
      `Invitation sent to ${invitedEmail} by ${req.user.id}`
    );
    res.status(201).json(invitation);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      err: "Internal Server Error!",
    });
  }
};

const getInvitations = async (req, res) => {
  try {
    let project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({
        msg: "Project not found!",
      });
    }
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(400).json({
        msg: "You are not authorized to view invitations for this project!",
      });
    }
    let invitations = await Invitation.find({ project: project._id });
    res.status(200).json({
      invitations,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const acceptInvitation = async (req, res) => {
  try {
    let invitation = await Invitation.findById(req.params.invitationId);
    if (!invitation) {
      return res.status(404).json({
        msg: "Invitation not found!",
      });
    }
    if (invitation.project.toString() !== req.params.projectId) {
      return res.status(400).json({
        msg: "Invitation does not belong to this project!",
      });
    }
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        msg: "User not found!",
      });
    }
    if (user.email.toLowerCase() !== invitation.invitedEmail) {
      return res.status(400).json({
        msg: "The Invitation is not intended for your account!",
      });
    }

    invitation.status = "Accepted";
    await invitation.save();
    // Notify project owner
    let project = await Project.findById(req.params.projectId);
    if (project && project.createdBy) {
      await createNotification({
        user: project.createdBy,
        type: "INVITATION",
        message: `${
          user.name || user.email
        } has accepted your invitation to join '${project.title}'.`,
        project: project._id,
      });
    }

    project = await Project.findById(req.params.projectId);

    // Check if user is already a team member
    const isAlreadyMember = project.teamMembers.some(
      (member) => member.user.toString() === req.user.id
    );

    if (!isAlreadyMember) {
      // Add user as team member with Member role
      project.teamMembers.push({
        user: req.user.id,
        role: "Member",
      });
      await project.save();
    }

    // Log activity: invitation accepted
    await logActivity(
      project._id,
      req.user.id,
      "INVITE_ACCEPTED",
      `Invitation accepted by ${user.name || user.email}`
    );
    res.status(200).json({
      msg: "Invitation Accepted!",
      invitation,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const declineInvitation = async (req, res) => {
  try {
    let invitation = await Invitation.findById(req.params.invitationId);
    if (!invitation) {
      return res.status(404).json({
        msg: "Invitation not found!",
      });
    }
    if (invitation.project.toString() !== req.params.projectId) {
      return res.status(400).json({
        msg: "Invitation does not belong to this project!",
      });
    }
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        msg: "User not found!",
      });
    }
    if (user.email.toLowerCase() !== invitation.invitedEmail) {
      return res.status(400).json({
        msg: "The Invitation is not intended for your account!",
      });
    }
    invitation.status = "Declined";
    await invitation.save();

    res.status(200).json({
      msg: "Invitation Declined!",
      invitation,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  sendInvitation,
  getInvitations,
  acceptInvitation,
  declineInvitation,
};

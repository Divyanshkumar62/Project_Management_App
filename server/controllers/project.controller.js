const { validationResult } = require("express-validator");
const Project = require('../models/Project')

const createProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { title, description, startDate, endDate, teamMembers } = req.body;
    try {
        const project = new Project({
            title,
            description,
            startDate,
            endDate,
            teamMembers: teamMembers || [],
            createdBy: req.user.id
        })
        await project.save();
        res.status(201).json(project);
    } catch (err){
        console.error(err.message)
        res.status(500).json({
            success: false,
            err: "Internal Server Error"
        })
    }
}

const getProject = async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [{ createdBy: req.user.id }, {teamMembers: req.user.id}]
        });
        res.status(200).json(projects);
    } catch (err) {
        console.error(err.message)
        res.status(500).json({
            success: false,
            err: "Internal Server Error"
        })
    }
}

const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if(!project){
            return res.status(404).json({msg: "Project not found"})
        }
        if(project.createdBy.toString() !== req.user.id && !project.teamMembers.includes(req.user.id)){
            return res.status(401).json({msg: "Not authorized"})
        }
        res.json(project);
    } catch (err){
        console.error(err.message)
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg: "Project not found"})
        }
        res.status(500).json("Internal Server Error")
    }
}

const updateProject = async (req, res) => {
    const { title, description, startDate, endDate, teamMembers, status } = req.body;
    const projectFields = {};
    if (title) projectFields.title = title;
    if (description) projectFields.description = description;
    if (startDate) projectFields.startDate = startDate;
    if (endDate) projectFields.endDate = endDate;
    if (status) projectFields.status = status;
    if (teamMembers) projectFields.teamMembers = teamMembers;

    try {
        let project = await Project.findById(req.params.id)
        if(!project){
            return res.status(404).json({msg: "Project not found!"})
        }
        if (project.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ msg: "Not authorized to update this project" });
        }
        project = await Project.findByIdAndUpdate(
            req.params.id,
            { $set: projectFields },
            { new: true }
        );
        res.json(project);
    } catch (err){
        console.error(err.message)
        res.status(500).json("Internal Server Error")
    }
}

const deleteProject = async (req, res) => {
    try {
        let project = await Project.findById(req.params.id)
        if(!project){
            return res.status(404).json({msg: "Project not found!"})
        }
        if (project.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ msg: "Not authorized to delete this project" });
        }
        await project.remove();
        res.status(200).res.json({
            success: true,
            msg: "Project removed"
        })
    } catch (err) {
        console.error(err.message)
        res.status(500).json("Internal Server Error")
    }
}

module.exports = { createProject, getProject, getProjectById, updateProject, deleteProject }
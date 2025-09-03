const Template = require('../models/Template');
const Project = require('../models/Project');
const Task = require('../models/Task');
const { validationResult } = require('express-validator');

// Get all templates
const getTemplates = async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = {
      $or: [
        { isPublic: true },
        { createdBy: req.user.id }
      ]
    };

    if (category) query.category = category;
    if (search) {
      query.$and = [
        query.$or ? { $or: query.$or } : {},
        {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        }
      ];
      delete query.$or;
    }

    const templates = await Template.find(query)
      .populate('createdBy', 'name')
      .sort({ usageCount: -1, createdAt: -1 });

    res.json(templates);
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ message: 'Error fetching templates' });
  }
};

// Create template
const createTemplate = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation error', errors: errors.array() });
    }

    const template = new Template({
      ...req.body,
      createdBy: req.user.id
    });

    await template.save();
    await template.populate('createdBy', 'name');
    
    res.status(201).json(template);
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({ message: 'Error creating template' });
  }
};

// Create project from template
const createProjectFromTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { title, description, startDate, endDate } = req.body;

    const template = await Template.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Create project
    const project = new Project({
      title,
      description,
      startDate,
      endDate,
      createdBy: req.user.id,
      teamMembers: [{ user: req.user.id, role: 'Owner' }],
      templateId: templateId
    });

    await project.save();

    // Create tasks from template
    const taskPromises = template.tasks.map(async (templateTask, index) => {
      const taskStartDate = new Date(startDate);
      taskStartDate.setDate(taskStartDate.getDate() + (index * 2)); // Stagger tasks

      const task = new Task({
        title: templateTask.title,
        description: templateTask.description,
        priority: templateTask.priority,
        dueDate: templateTask.estimatedDays ? 
          new Date(taskStartDate.getTime() + (templateTask.estimatedDays * 24 * 60 * 60 * 1000)) : 
          undefined,
        project: project._id,
        createdBy: req.user.id
      });

      await task.save();
      return task._id;
    });

    const taskIds = await Promise.all(taskPromises);
    project.tasks = taskIds;
    await project.save();

    // Increment usage count
    template.usageCount += 1;
    await template.save();

    await project.populate('createdBy teamMembers.user', 'name email');
    res.status(201).json(project);
  } catch (error) {
    console.error('Create project from template error:', error);
    res.status(500).json({ message: 'Error creating project from template' });
  }
};

// Delete template
const deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    if (template.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this template' });
    }

    await Template.findByIdAndDelete(req.params.id);
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Delete template error:', error);
    res.status(500).json({ message: 'Error deleting template' });
  }
};

module.exports = {
  getTemplates,
  createTemplate,
  createProjectFromTemplate,
  deleteTemplate
};

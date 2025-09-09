const Resource = require('../models/Resource');
const Project = require('../models/Project');
const User = require('../models/User');

// Get resource for current user
const getUserResource = async (req, res) => {
  try {
    const resource = await Resource.findOne({ user: req.user.id })
      .populate('user', 'name email')
      .populate('allocations.project', 'title');

    if (!resource) {
      // Create default resource profile if not exists
      const newResource = new Resource({
        user: req.user.id,
        capacity: 40 // 40 hours/week default
      });
      await newResource.save();
      await newResource.populate('user', 'name email');
      return res.json(newResource);
    }

    res.json(resource);
  } catch (error) {
    console.error('Get user resource error:', error);
    res.status(500).json({ message: 'Error retrieving resource profile' });
  }
};

// Update user resource profile
const updateUserResource = async (req, res) => {
  try {
    const { capacity, skills } = req.body;

    const resource = await Resource.findOneAndUpdate(
      { user: req.user.id },
      {
        capacity,
        $addToSet: { skills: { $each: skills || [] } }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).populate('user', 'name email')
      .populate('allocations.project', 'title');

    res.json(resource);
  } catch (error) {
    console.error('Update user resource error:', error);
    res.status(500).json({ message: 'Error updating resource profile' });
  }
};

// Allocate user to project
const allocateResource = async (req, res) => {
  try {
    const { projectId, hoursAllocated, startDate, endDate } = req.body;

    // Verify project exists and user is member
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isMember = project.teamMembers.some(member =>
      member.user.toString() === req.user.id
    );

    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized for this project' });
    }

    // Find or create resource profile
    let resource = await Resource.findOne({ user: req.user.id });
    if (!resource) {
      resource = new Resource({
        user: req.user.id,
        capacity: 40
      });
    }

    // Add allocation
    resource.allocations.push({
      project: projectId,
      hoursAllocated,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: 'Active'
    });

    await resource.save();
    await resource.populate([
      'user',
      'allocations.project'
    ]);

    res.json(resource);
  } catch (error) {
    console.error('Allocate resource error:', error);
    res.status(500).json({ message: 'Error allocating resource' });
  }
};

// Update resource allocation
const updateAllocation = async (req, res) => {
  try {
    const { projectId, allocationId } = req.params;
    const { hoursAllocated, startDate, endDate, status } = req.body;

    const resource = await Resource.findOne({
      user: req.user.id,
      'allocations._id': allocationId
    });

    if (!resource) {
      return res.status(404).json({ message: 'Allocation not found' });
    }

    const allocation = resource.allocations.id(allocationId);
    if (!allocation) {
      return res.status(404).json({ message: 'Allocation not found' });
    }

    allocation.hoursAllocated = hoursAllocated || allocation.hoursAllocated;
    if (startDate) allocation.startDate = new Date(startDate);
    if (endDate) allocation.endDate = new Date(endDate);
    if (status) allocation.status = status;

    await resource.save();
    await resource.populate([
      'user',
      'allocations.project'
    ]);

    res.json(resource);
  } catch (error) {
    console.error('Update allocation error:', error);
    res.status(500).json({ message: 'Error updating allocation' });
  }
};

// Remove resource allocation
const removeAllocation = async (req, res) => {
  try {
    const { allocationId } = req.params;

    const resource = await Resource.findOne({
      user: req.user.id,
      'allocations._id': allocationId
    });

    if (!resource) {
      return res.status(404).json({ message: 'Allocation not found' });
    }

    resource.allocations.pull(allocationId);
    await resource.save();
    await resource.populate([
      'user',
      'allocations.project'
    ]);

    res.json(resource);
  } catch (error) {
    console.error('Remove allocation error:', error);
    res.status(500).json({ message: 'Error removing allocation' });
  }
};

// Get project resources
const getProjectResources = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId)
      .populate('teamMembers.user', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is project member
    const isMember = project.teamMembers.some(member =>
      member.user._id.toString() === req.user.id
    );

    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Get resources for all team members
    const userIds = project.teamMembers.map(member => member.user._id);
    const resources = await Resource.find({ user: { $in: userIds } })
      .populate('user', 'name email');

    res.json(resources);
  } catch (error) {
    console.error('Get project resources error:', error);
    res.status(500).json({ message: 'Error retrieving project resources' });
  }
};

// Update availability
const updateAvailability = async (req, res) => {
  try {
    const { date, available, reason, notes } = req.body;

    let resource = await Resource.findOne({ user: req.user.id });
    if (!resource) {
      resource = new Resource({ user: req.user.id, capacity: 40 });
    }

    // Find existing availability entry for this date
    const existingAvailability = resource.availability.find(
      a => new Date(a.date).toDateString() === new Date(date).toDateString()
    );

    if (existingAvailability) {
      existingAvailability.available = available;
      if (reason) existingAvailability.reason = reason;
      if (notes !== undefined) existingAvailability.notes = notes;
    } else {
      resource.availability.push({
        date: new Date(date),
        available,
        reason,
        notes
      });
    }

    await resource.save();
    res.json(resource);
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ message: 'Error updating availability' });
  }
};

module.exports = {
  getUserResource,
  updateUserResource,
  allocateResource,
  updateAllocation,
  removeAllocation,
  getProjectResources,
  updateAvailability
};

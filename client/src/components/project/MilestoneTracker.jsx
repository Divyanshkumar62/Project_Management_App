import React, { useState, useEffect } from 'react';
import { FaPlus, FaCalendar, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';

const MilestoneTracker = ({ project, tasks = [] }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [milestones, setMilestones] = useState([]);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    dueDate: ''
  });

  // Initialize milestones based on project data
  useEffect(() => {
    if (project) {
      // Use project milestones if they exist, otherwise create default ones
      const projectMilestones = project.milestones || [];
      
      if (projectMilestones.length === 0) {
        // Create default milestones based on project timeline
        const startDate = new Date(project.startDate || project.createdAt);
        const endDate = project.endDate ? new Date(project.endDate) : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
        const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        
        const defaultMilestones = [
          {
            _id: 'default-1',
            title: 'Project Kickoff',
            description: 'Project initialization and team setup',
            dueDate: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'Completed',
            completedAt: startDate.toISOString()
          },
          {
            _id: 'default-2',
            title: 'Mid-Project Review',
            description: 'Review progress and adjust timeline if needed',
            dueDate: new Date(startDate.getTime() + (duration * 0.5) * 24 * 60 * 60 * 1000).toISOString(),
            status: tasks.length > 0 && tasks.filter(t => t.status === 'Completed').length > tasks.length * 0.3 ? 'Completed' : 'Pending'
          },
          {
            _id: 'default-3',
            title: 'Project Completion',
            description: 'Final deliverables and project closure',
            dueDate: endDate.toISOString(),
            status: tasks.length > 0 && tasks.filter(t => t.status === 'Completed').length === tasks.length ? 'Completed' : 'Pending'
          }
        ];
        
        setMilestones(defaultMilestones);
      } else {
        setMilestones(projectMilestones);
      }
    }
  }, [project, tasks]);

  const handleAddMilestone = (e) => {
    e.preventDefault();
    const milestone = {
      _id: Date.now().toString(),
      ...newMilestone,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    setMilestones([...milestones, milestone]);
    setNewMilestone({ title: '', description: '', dueDate: '' });
    setShowAddModal(false);
  };

  const handleStatusChange = (milestoneId, status) => {
    setMilestones(milestones.map(milestone => 
      milestone._id === milestoneId 
        ? { 
            ...milestone, 
            status, 
            completedAt: status === 'Completed' ? new Date().toISOString() : null 
          }
        : milestone
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <FaCheckCircle className="text-green-600" />;
      case 'Overdue': return <FaExclamationTriangle className="text-red-600" />;
      default: return <FaClock className="text-yellow-600" />;
    }
  };

  // Calculate progress
  const completedMilestones = milestones.filter(m => m.status === 'Completed').length;
  const progressPercentage = milestones.length > 0 ? (completedMilestones / milestones.length) * 100 : 0;

  // Sort milestones by due date
  const sortedMilestones = [...milestones].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FaCalendar className="text-blue-500" />
            Project Milestones
          </h3>
          <div className="flex items-center mt-3">
            <div className="w-64 bg-gray-200 rounded-full h-3 mr-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {completedMilestones}/{milestones.length} completed ({Math.round(progressPercentage)}%)
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center gap-2"
        >
          <FaPlus size={12} />
          Add Milestone
        </button>
      </div>

      {/* Milestones Timeline */}
      <div className="space-y-4">
        {sortedMilestones.map((milestone, index) => {
          const isOverdue = new Date(milestone.dueDate) < new Date() && milestone.status !== 'Completed';
          const actualStatus = isOverdue ? 'Overdue' : milestone.status;
          
          return (
            <div key={milestone._id} className="relative">
              {/* Timeline line */}
              {index < sortedMilestones.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
              )}
              
              <div className="flex items-start gap-4">
                {/* Status icon */}
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${getStatusColor(actualStatus)}`}>
                  {getStatusIcon(actualStatus)}
                </div>
                
                {/* Content */}
                <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                      {milestone.description && (
                        <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(actualStatus)}`}>
                      {actualStatus}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-4 text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaCalendar size={12} />
                        Due: {new Date(milestone.dueDate).toLocaleDateString()}
                      </span>
                      {milestone.completedAt && (
                        <span className="text-green-600 flex items-center gap-1">
                          <FaCheckCircle size={12} />
                          Completed {new Date(milestone.completedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    
                    {milestone.status !== 'Completed' && (
                      <button
                        onClick={() => handleStatusChange(milestone._id, 'Completed')}
                        className="text-green-600 hover:text-green-800 font-medium text-sm px-3 py-1 rounded-lg hover:bg-green-50 transition-colors"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {milestones.length === 0 && (
        <div className="text-center py-12">
          <FaCalendar size={48} className="mx-auto text-gray-300 mb-4" />
          <h4 className="text-lg font-medium text-gray-600 mb-2">No milestones yet</h4>
          <p className="text-gray-500 mb-4">Create milestones to track important project phases</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create First Milestone
          </button>
        </div>
      )}

      {/* Add Milestone Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaPlus className="text-blue-500" />
              Add New Milestone
            </h3>
            
            <form onSubmit={handleAddMilestone}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Design Phase Complete"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe what this milestone represents..."
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
                <input
                  type="date"
                  value={newMilestone.dueDate}
                  onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add Milestone
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneTracker;

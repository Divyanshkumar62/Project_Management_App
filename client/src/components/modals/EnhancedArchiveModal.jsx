import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const EnhancedArchiveModal = ({ project, closeModal }) => {
  const [formData, setFormData] = useState({
    reason: '',
    completionSummary: '',
    lessonsLearned: ''
  });
  const [isArchiving, setIsArchiving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsArchiving(true);
    
    // Simulate API call
    setTimeout(() => {
      alert('Project archived successfully! (Demo mode - no actual archiving)');
      setIsArchiving(false);
      closeModal();
    }, 2000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Calculate project stats
  const projectStart = new Date(project.startDate || project.createdAt);
  const projectEnd = new Date();
  const actualDays = Math.ceil((projectEnd - projectStart) / (1000 * 60 * 60 * 24));
  const totalTasks = project.tasks?.length || 0;
  const teamMembers = project.teamMembers?.length || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Archive Project</h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
            <p className="text-gray-600">
              Archiving this project will preserve all data and move it out of your active projects list.
              Please provide some details about the project completion.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Archive Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Archive Reason *
              </label>
              <select
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a reason</option>
                <option value="Completed Successfully">Completed Successfully</option>
                <option value="Cancelled">Cancelled</option>
                <option value="On Hold">On Hold</option>
                <option value="Merged with Another Project">Merged with Another Project</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Completion Summary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Summary
              </label>
              <textarea
                name="completionSummary"
                value={formData.completionSummary}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Briefly describe what was accomplished in this project..."
              />
            </div>

            {/* Lessons Learned */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lessons Learned
              </label>
              <textarea
                name="lessonsLearned"
                value={formData.lessonsLearned}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What went well? What could be improved for future projects?"
              />
            </div>

            {/* Project Stats Preview */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Project Statistics</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Tasks:</span>
                  <span className="ml-2 font-medium">{totalTasks}</span>
                </div>
                <div>
                  <span className="text-gray-600">Team Members:</span>
                  <span className="ml-2 font-medium">{teamMembers}</span>
                </div>
                <div>
                  <span className="text-gray-600">Start Date:</span>
                  <span className="ml-2 font-medium">
                    {projectStart.toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <span className="ml-2 font-medium">{actualDays} days</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isArchiving}
                className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                {isArchiving ? 'Archiving...' : 'Archive Project'}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnhancedArchiveModal;

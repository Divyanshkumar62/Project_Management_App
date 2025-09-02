import React, { useRef, useEffect } from "react";
import { FaTimes, FaCalendar, FaUsers, FaTasks } from "react-icons/fa";
import { useTasks } from "../../hooks/useTasks";

const ProjectDetailsModal = ({ project, closeModal }) => {
  const modalRef = useRef(null);
  
  // Fetch tasks for this specific project
  const { data: projectTasks = [], isLoading: tasksLoading } = useTasks(project._id);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeModal]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Planning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-500';
      case 'In Progress': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-[99999]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden" ref={modalRef}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="w-8"></div> {/* Spacer for centering */}
          <h2 className="text-2xl font-bold text-gray-900 text-center">{project.title}</h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Project Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <FaCalendar className="mr-2 text-blue-500" />
                Project Details
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Start Date:</span>
                  <span className="ml-2 text-sm text-gray-700">
                    {new Date(project.startDate).toLocaleDateString()}
                  </span>
                </div>
                {project.endDate && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">End Date:</span>
                    <span className="ml-2 text-sm text-gray-700">
                      {new Date(project.endDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-gray-500">Created:</span>
                  <span className="ml-2 text-sm text-gray-700">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <FaUsers className="mr-2 text-green-500" />
                Team Members ({project.teamMembers?.length || 0})
              </h3>
              <div className="space-y-2">
                {project.teamMembers?.map((member) => (
                  <div key={member._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">{member.user?.name || 'Unknown'}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      member.role === 'Owner' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {member.role}
                    </span>
                  </div>
                )) || <p className="text-sm text-gray-500">No team members</p>}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">{project.description}</p>
          </div>

          {/* Tasks */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <FaTasks className="mr-2 text-orange-500" />
              Tasks ({tasksLoading ? '...' : projectTasks.length})
            </h3>
            {tasksLoading ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading tasks...</div>
              </div>
            ) : projectTasks.length > 0 ? (
              <div className="space-y-3">
                {projectTasks.map((task) => (
                  <div key={task._id} className={`border-l-4 border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow ${
                    task.priority === 'High' ? 'border-l-red-500' :
                    task.priority === 'Medium' ? 'border-l-yellow-500' :
                    'border-l-green-500'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className={`w-3 h-3 rounded-full mr-3 ${getTaskStatusColor(task.status)}`}></span>
                          <h4 className="font-medium text-gray-900">{task.title}</h4>
                          <span className={`ml-2 text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        {task.description && (
                          <p className="text-sm text-gray-600 mb-2 ml-6">{task.description}</p>
                        )}
                        <div className="flex items-center text-xs text-gray-500 ml-6">
                          {task.assignedTo && (
                            <span className="mr-4">Assigned to: {task.assignedTo.name}</span>
                          )}
                          {task.dueDate && (
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No tasks created yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;

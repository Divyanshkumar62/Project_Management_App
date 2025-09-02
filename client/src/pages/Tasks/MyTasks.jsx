import React, { useState } from "react";
import { useUserTasks } from "../../hooks/useTasks";
import Sidebar from "../../components/dashboard/Sidebar";

const MyTasks = () => {
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    q: ""
  });

  const { data: tasks = [], isLoading, error } = useUserTasks(filters);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-500';
      case 'In Progress': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  // Sort tasks: most recent first, then by priority
  const sortedTasks = [...tasks].sort((a, b) => {
    // First sort by creation date (most recent first)
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    if (dateB - dateA !== 0) return dateB - dateA;
    
    // Then by priority (High > Medium > Low)
    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
    return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Error loading tasks: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">My Tasks</h1>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {sortedTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            {filters.q || filters.status || filters.priority 
              ? "No tasks found matching your filters." 
              : "No tasks assigned to you yet."}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedTasks.map((task) => (
            <div
              key={task._id}
              className={`border-l-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                task.priority === 'High' ? 'border-red-500' :
                task.priority === 'Medium' ? 'border-yellow-500' :
                'border-green-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className={`w-3 h-3 rounded-full mr-3 ${getStatusColor(task.status)}`}></span>
                    <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                    <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  
                  {task.description && (
                    <p className="text-gray-600 mb-3 ml-6">{task.description}</p>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-500 ml-6 space-x-4">
                    <span>Project: {task.project?.title || 'Unknown'}</span>
                    {task.dueDate && (
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    )}
                    <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default MyTasks;

import React, { useState, useMemo } from "react";
import { useUserTasks } from "../../hooks/useTasks";
import Sidebar from "../../components/dashboard/Sidebar";
import { useDebounce } from "../../hooks/useDebounce";

const MyTasks = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  
  const debouncedSearch = useDebounce(search, 300);

  // Fetch all user tasks without filters first
  const { data: allTasks = [], isLoading, error } = useUserTasks();

  // Apply filters and sorting client-side
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = [...allTasks];

    // Apply search filter
    if (debouncedSearch) {
      filtered = filtered.filter(task => 
        task.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        task.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Apply status filter
    if (status) {
      filtered = filtered.filter(task => task.status === status);
    }

    // Apply priority filter
    if (priority) {
      filtered = filtered.filter(task => task.priority === priority);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title?.toLowerCase() || '';
          bValue = b.title?.toLowerCase() || '';
          return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        
        case 'status':
          const statusOrder = { 'To Do': 1, 'In Progress': 2, 'Completed': 3 };
          aValue = statusOrder[a.status] || 0;
          bValue = statusOrder[b.status] || 0;
          return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        
        case 'priority':
          const priorityOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
          return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        
        case 'dueDate':
          aValue = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31');
          bValue = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31');
          return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        
        case 'updatedAt':
          aValue = new Date(a.updatedAt || a.createdAt);
          bValue = new Date(b.updatedAt || b.createdAt);
          return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        
        default: // createdAt
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });

    return filtered;
  }, [allTasks, debouncedSearch, status, priority, sortBy, sortOrder]);

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

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-lg">Loading tasks...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-red-500">Error loading tasks: {error.message}</div>
        </div>
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
            
            {/* Search and Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 min-w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Sort Controls */}
            <div className="flex gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="createdAt">Date Created</option>
                  <option value="updatedAt">Last Updated</option>
                  <option value="title">Title</option>
                  <option value="status">Status</option>
                  <option value="priority">Priority</option>
                  <option value="dueDate">Due Date</option>
                </select>
              </div>
              
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>

          {filteredAndSortedTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">
                {search || status || priority 
                  ? "No tasks found matching your filters." 
                  : "No tasks assigned to you yet."}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedTasks.map((task) => (
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

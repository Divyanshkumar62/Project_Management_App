import React, { useState, useEffect } from "react";
import { useUpdateTaskStatus } from "../../hooks/useTasks";
import { FaEdit, FaTrash, FaCalendar, FaUser } from "react-icons/fa";

const TaskCard = ({ task, projectId, onEdit, onDelete }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [localTask, setLocalTask] = useState(task); // Local state for optimistic updates
  const updateTaskStatusMutation = useUpdateTaskStatus();

  // Update local task when props change
  useEffect(() => {
    setLocalTask(task);
  }, [task]);

  // Extract projectId from task.project if not provided as prop
  const effectiveProjectId = projectId || task?.project?._id || task?.project;

  const statusColors = {
    "To Do": "bg-gray-100 text-gray-800",
    "In Progress": "bg-blue-100 text-blue-800",
    "Completed": "bg-green-100 text-green-800"
  };

  const statusOptions = ["To Do", "In Progress", "Completed"];

  const priorityColors = {
    "Low": "text-green-600",
    "Medium": "text-yellow-600",
    "High": "text-red-600"
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus === task.status) return;

    // Optimistic update - update local state immediately
    setLocalTask(prev => ({ ...prev, status: newStatus }));
    setIsUpdating(true);

    try {
      await updateTaskStatusMutation.mutateAsync({
        projectId: effectiveProjectId,
        taskId: task._id,
        status: newStatus
      });
      // Success - local state is already updated
    } catch (error) {
      console.error("Failed to update task status:", error);
      // Revert optimistic update on failure
      setLocalTask(task);
      // TODO: Add error notification here
    } finally {
      setIsUpdating(false);
    }
  };

  const getDaysUntilDue = () => {
    if (!task.dueDate) return null;
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    const diffTime = dueDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: `${Math.abs(diffDays)} days overdue`, color: "text-red-600", urgent: true };
    if (diffDays === 0) return { text: "Due today", color: "text-orange-600", urgent: true };
    if (diffDays <= 3) return { text: `${diffDays} days left`, color: "text-yellow-600", urgent: true };
    if (diffDays <= 7) return { text: `${diffDays} days left`, color: "text-blue-600", urgent: false };
    return { text: `${diffDays} days left`, color: "text-gray-600", urgent: false };
  };

  const dueDateInfo = getDaysUntilDue();

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
      task.priority === 'High' ? 'border-l-4 border-l-red-500' :
      task.priority === 'Medium' ? 'border-l-4 border-l-yellow-500' :
      'border-l-4 border-l-green-500'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 leading-tight">{task.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]} bg-opacity-20 ${task.priority === 'High' ? 'bg-red-100' : task.priority === 'Medium' ? 'bg-yellow-100' : 'bg-green-100'}`}>
              {task.priority}
            </span>
          </div>
          {task.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 ml-3">
          <button
            onClick={() => onEdit && onEdit(task)}
            className="text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit task"
          >
            <FaEdit size={14} />
          </button>
          <button
            onClick={() => onDelete && onDelete(task)}
            className="text-gray-400 hover:text-red-600 transition-colors"
            title="Delete task"
          >
            <FaTrash size={14} />
          </button>
        </div>
      </div>

      {/* Task Meta */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        {task.assignedTo && task.assignedTo.name && (
          <div className="flex items-center gap-1">
            <FaUser size={12} />
            <span>{task.assignedTo.name}</span>
          </div>
        )}

        {task.dueDate && (
          <div className={`flex items-center gap-1 ${dueDateInfo?.color || 'text-gray-500'}`}>
            <FaCalendar size={12} />
            <span>{dueDateInfo?.text || new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Status Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</span>
          <select
            value={localTask.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isUpdating}
            className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${statusColors[localTask.status]} ${
              isUpdating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-gray-400">
          {task.createdAt && `Created ${new Date(task.createdAt).toLocaleDateString()}`}
        </div>
      </div>

      {/* Loading overlay during status update */}
      {isUpdating && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;

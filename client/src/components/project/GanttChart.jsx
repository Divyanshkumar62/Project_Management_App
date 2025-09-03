import React, { useMemo } from 'react';
import { FaCalendar, FaTasks, FaClock, FaCheckCircle } from 'react-icons/fa';

const GanttChart = ({ tasks = [], project }) => {
  // Calculate timeline data
  const timelineData = useMemo(() => {
    if (!tasks.length || !project) return null;

    const projectStart = new Date(project.startDate || project.createdAt);
    const projectEnd = project.endDate ? new Date(project.endDate) : new Date();
    
    // If no project end date, calculate based on tasks or default to 60 days
    const calculatedEnd = tasks.length > 0 
      ? new Date(Math.max(...tasks.map(t => new Date(t.dueDate || t.createdAt))))
      : new Date(projectStart.getTime() + 60 * 24 * 60 * 60 * 1000);
    
    const endDate = projectEnd > calculatedEnd ? projectEnd : calculatedEnd;
    const totalDays = Math.ceil((endDate - projectStart) / (1000 * 60 * 60 * 24));
    
    // Generate date range for header
    const dateRange = [];
    for (let i = 0; i <= totalDays; i += Math.max(1, Math.floor(totalDays / 10))) {
      const date = new Date(projectStart.getTime() + i * 24 * 60 * 60 * 1000);
      dateRange.push(date);
    }

    return {
      projectStart,
      projectEnd: endDate,
      totalDays,
      dateRange
    };
  }, [tasks, project]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-500';
      case 'In Progress': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  const getTaskPosition = (task) => {
    if (!timelineData) return { left: 0, width: 0 };
    
    const taskStart = new Date(task.createdAt);
    const taskEnd = new Date(task.dueDate || task.updatedAt || task.createdAt);
    
    // Ensure task dates are within project timeline
    const startDate = taskStart < timelineData.projectStart ? timelineData.projectStart : taskStart;
    const endDate = taskEnd > timelineData.projectEnd ? timelineData.projectEnd : taskEnd;
    
    const startOffset = Math.max(0, (startDate - timelineData.projectStart) / (1000 * 60 * 60 * 24));
    const duration = Math.max(1, (endDate - startDate) / (1000 * 60 * 60 * 24));
    
    const leftPercent = (startOffset / timelineData.totalDays) * 100;
    const widthPercent = (duration / timelineData.totalDays) * 100;
    
    return {
      left: `${Math.min(leftPercent, 95)}%`,
      width: `${Math.max(widthPercent, 2)}%`
    };
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  if (!timelineData || tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-12">
          <FaTasks size={48} className="mx-auto text-gray-300 mb-4" />
          <h4 className="text-lg font-medium text-gray-600 mb-2">No timeline data</h4>
          <p className="text-gray-500">
            {tasks.length === 0 
              ? 'Create some tasks to see the project timeline'
              : 'Unable to generate timeline from current data'
            }
          </p>
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const todoTasks = tasks.filter(t => t.status === 'To Do').length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FaCalendar className="text-blue-500" />
            Project Timeline
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {timelineData.projectStart.toLocaleDateString()} - {timelineData.projectEnd.toLocaleDateString()} 
            ({timelineData.totalDays} days)
          </p>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded"></div>
            <span>To Do ({todoTasks})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>In Progress ({inProgressTasks})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Completed ({completedTasks})</span>
          </div>
        </div>
      </div>

      {/* Timeline Header */}
      <div className="mb-4 overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="flex border-b border-gray-200 pb-2 mb-4">
            <div className="w-64 flex-shrink-0 font-medium text-gray-700">Task</div>
            <div className="flex-1 relative">
              <div className="flex justify-between text-xs text-gray-500">
                {timelineData.dateRange.map((date, index) => (
                  <span key={index} className="text-center">
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Task Rows */}
          <div className="space-y-3">
            {tasks.map((task) => {
              const position = getTaskPosition(task);
              return (
                <div key={task._id} className="flex items-center">
                  {/* Task Info */}
                  <div className="w-64 flex-shrink-0 pr-4">
                    <div className={`border-l-4 pl-3 ${getPriorityColor(task.priority)}`}>
                      <h4 className="font-medium text-gray-900 text-sm truncate">
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          {task.status === 'Completed' ? (
                            <FaCheckCircle className="text-green-500" />
                          ) : (
                            <FaClock className="text-gray-400" />
                          )}
                          {task.status}
                        </span>
                        {task.priority && (
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            task.priority === 'High' ? 'bg-red-100 text-red-700' :
                            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {task.priority}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Timeline Bar */}
                  <div className="flex-1 relative h-8 bg-gray-50 rounded">
                    <div
                      className={`absolute top-1 bottom-1 rounded ${getStatusColor(task.status)} opacity-80 hover:opacity-100 transition-opacity cursor-pointer`}
                      style={{
                        left: position.left,
                        width: position.width
                      }}
                      title={`${task.title} (${task.status})`}
                    >
                      <div className="h-full flex items-center justify-center text-white text-xs font-medium px-2">
                        {position.width.replace('%', '') > 10 && task.title.substring(0, 15)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Project Progress */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm text-gray-600">
            {Math.round((completedTasks / tasks.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(completedTasks / tasks.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;

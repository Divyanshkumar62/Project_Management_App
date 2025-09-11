import React, { useState, useEffect } from "react";
import { useProjects } from "../../hooks/useProjects";
import { useUserTasks } from "../../hooks/useTasks";
import { SkeletonStats } from "../ui/SkeletonCard";
import { on, joinProjectRoom, leaveProjectRoom } from "../../socket/socketClient";

const ProjectStats = () => {
  const {
    data: projects = [],
    isLoading: projectsLoading,
    error: projectsError
  } = useProjects();

  const {
    data: userTasks = [],
    isLoading: tasksLoading,
    error: tasksError
  } = useUserTasks();

  // Debug logging (remove in production)
  console.log('📊 ProjectStats Debug:', {
    projectsCount: projects.length,
    projectsLoading,
    projectsError,
    tasksCount: userTasks.length,
    tasksLoading,
    tasksError
  });
  const [recentActivities, setRecentActivities] = useState([]);

  // Set up real-time activity tracking (before conditional return!)
  useEffect(() => {
    // Join all project rooms for activity tracking
    projects.forEach(project => {
      joinProjectRoom(project._id);
    });

    // Listen for task-related activities
    const handleTaskActivity = (action) => {
      const timestamp = new Date().toISOString();
      const getProjectName = (projectId) => {
        return projects.find(p => p._id === projectId)?.title || 'Unknown Project';
      };

      // Add new activity to recent activities
      setRecentActivities(prev => [{
        id: `${action.type}_${Date.now()}`,
        message: action.message || `${action.type.toLowerCase().replace('_', ' ')} occurred`,
        project: getProjectName(action.project),
        timestamp,
        type: action.type
      }, ...prev.slice(0, 9)]); // Keep only last 10 activities
    };

    // Subscribe to socket events for all projects
    const eventHandlers = [
      on('created', handleTaskActivity),
      on('updated', handleTaskActivity),
      on('deleted', handleTaskActivity),
    ];

    // Cleanup when projects change
    return () => {
      eventHandlers.forEach(unsubscribe => unsubscribe());
    };
  }, [projects]);

  // Calculate stats (only for render, not hooks)
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const completionPercentage = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

  const totalTasks = userTasks.length;
  const completedTasks = userTasks.filter(t => t.status === 'completed').length;

  // Get current active tasks (not completed)
  const activeTasks = userTasks.filter(t => t.status !== 'completed').slice(0, 5); // Limit to 5

  // Show skeleton while loading
  if (projectsLoading || tasksLoading) {
    return <SkeletonStats />;
  }

  return (
    <aside className="bg-white p-6 m-3 rounded-xl shadow-lg flex flex-col border border-gray-100 h-fit max-h-screen">
      <h1 className="text-xl font-bold text-gray-800 mb-6">Project Progress</h1>

      {/* Error Messages */}
      {projectsError && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg text-sm mb-4">
          Projects Error: {projectsError.message}
        </div>
      )}

      {tasksError && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg text-sm mb-4">
          Tasks Error: {tasksError.message}
        </div>
      )}

      <div className="relative mb-6">
        <div className="rounded-full bg-gradient-to-br from-blue-400 to-blue-600 w-36 h-36 flex justify-center items-center shadow-lg mx-auto">
          <h1 className="text-3xl font-bold text-white">{completionPercentage}%</h1>
        </div>
      </div>

      <div className="text-center mb-6">
        <h3 className="font-semibold text-gray-800">{completedProjects} of {totalProjects} Projects</h3>
        <p className="text-sm text-gray-600">{completedTasks} of {totalTasks} Tasks Done</p>
        {totalProjects === 0 && <p className="text-xs text-orange-600 mt-1">Create your first project to see data!</p>}
        {totalTasks === 0 && <p className="text-xs text-orange-600 mt-1">Create tasks to start tracking progress!</p>}
      </div>
      
      <div className="flex-1 flex flex-col min-h-0">
        <h2 className="text-blue-700 text-lg font-medium mb-3 text-center">Current Tasks:</h2>
        <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2">
          {activeTasks.length > 0 ? (
            activeTasks.map((task) => (
              <div key={task._id} className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-400">
                <h3 className="font-medium text-sm text-gray-800 truncate">
                  {task.title}
                </h3>
                <p className="text-xs text-gray-500 capitalize">{task.priority} priority</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">No active tasks</p>
          )}
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="flex-1 flex flex-col min-h-0 mt-6">
        <h2 className="text-blue-700 text-lg font-medium mb-3 text-center">Recent Activity</h2>
        <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity) => (
              <div key={activity.id} className="bg-gray-50 p-3 rounded-lg border-l-4 border-green-400">
                <h3 className="font-medium text-sm text-gray-800 truncate">
                  {activity.message}
                </h3>
                <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                  <span className="truncate">{activity.project}</span>
                  <span>{new Date(activity.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <div className="mb-3">
                <div className="w-12 h-12 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-2">
                  🔄
                </div>
                <p className="text-gray-500 text-xs">
                  Waiting for activity...
                </p>
              </div>
              {projectsLoading || tasksLoading ? (
                <p className="text-xs text-gray-400">
                  Loading data...
                </p>
              ) : (
                <p className="text-xs text-gray-400">
                  Create tasks to see real-time updates!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default ProjectStats;

import React from "react";
import { useProjects } from "../../hooks/useProjects";
import { useUserTasks } from "../../hooks/useTasks";

const ProjectStats = () => {
  const { data: projects = [] } = useProjects();
  const { data: userTasks = [] } = useUserTasks();

  // Calculate stats
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const completionPercentage = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;
  
  const totalTasks = userTasks.length;
  const completedTasks = userTasks.filter(t => t.status === 'completed').length;
  
  // Get current active tasks (not completed)
  const activeTasks = userTasks.filter(t => t.status !== 'completed');

  return (
    <aside className="bg-white p-6 m-3 rounded-xl shadow-lg flex flex-col border border-gray-100 h-fit max-h-screen">
      <h1 className="text-xl font-bold text-gray-800 mb-6">Project Progress</h1>
      
      <div className="relative mb-6">
        <div className="rounded-full bg-gradient-to-br from-blue-400 to-blue-600 w-36 h-36 flex justify-center items-center shadow-lg mx-auto">
          <h1 className="text-3xl font-bold text-white">{completionPercentage}%</h1>
        </div>
      </div>
      
      <div className="text-center mb-6">
        <h3 className="font-semibold text-gray-800">{completedProjects} of {totalProjects} Projects</h3>
        <p className="text-sm text-gray-600">{completedTasks} of {totalTasks} Tasks Done</p>
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
    </aside>
  );
};

export default ProjectStats;

import { useContext, useEffect, lazy, Suspense, useState } from "react";
import { DashboardProvider } from "../../context/DashboardContext";
import ProjectDashboard from "./ProjectDashboard";
import { ActivityProvider } from "../../context/ActivityContext";
import ActivityLog from "./ActivityLog";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { TaskContext } from "../../context/TaskContext";
import { ProjectContext } from "../../context/ProjectContext";
import Sidebar from "../../components/dashboard/Sidebar";
import MilestoneTracker from '../../components/project/MilestoneTracker';
import GanttChart from '../../components/project/GanttChart';
import EnhancedArchiveModal from '../../components/modals/EnhancedArchiveModal';
import TasksTab from '../../components/project/TasksTab';
import DeleteConfirmationModal from '../../components/modals/DeleteConfirmationModal';

// Lazy load components
const CreateTaskModal = lazy(() =>
  import("../../components/modals/CreateTaskModal")
);

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, isProjectOwner, deleteProject } = useContext(ProjectContext);
  const {
    projectTasks,
    projectTasksLoading,
    projectTasksError,
    loadProjectTasks,
    updateTaskStatusById,
  } = useContext(TaskContext);
  const queryClient = useQueryClient();
  const [localTasks, setLocalTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState("tasks");
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentProject = projects.find((p) => p._id === projectId);
    setProject(currentProject);
    if (projectId) {
      loadProjectTasks(projectId);
    }
  }, [projectId, projects, loadProjectTasks]);

  useEffect(() => {
    if (projectTasks) {
      setLocalTasks(projectTasks);
    }
  }, [projectTasks]);

  const handleTaskUpdate = async (taskId, updates) => {
    console.log('handleTaskUpdate called with:', { taskId, updates, projectId });
    try {
      await updateTaskStatusById(projectId, taskId, updates.status);
      // Update local state immediately for better UX
      setLocalTasks(prev => 
        prev.map(task => 
          task._id === taskId ? { ...task, ...updates } : task
        )
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteProject = async () => {
    setIsDeleting(true);
    try {
      await deleteProject(projectId);
      navigate("/projects");
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (!project) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <div>Loading project details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (projectTasksError) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">{project.title}</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error loading tasks for this project.</p>
            <button 
              onClick={() => loadProjectTasks(projectId)}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <ActivityProvider>
          <div className="p-6">
            {/* Project Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
                  <p className="text-gray-600">{project.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                    {project.startDate && (
                      <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
                    )}
                    {project.endDate && (
                      <span>End: {new Date(project.endDate).toLocaleDateString()}</span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'Active' ? 'bg-green-100 text-green-800' :
                      project.status === 'Planning' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status || 'Active'}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {/* Project management buttons */}
                  {(isProjectOwner(projectId) || true) && (
                    <>
                      <button
                        onClick={() => setShowArchiveModal(true)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Archive Project
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Delete Project
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: 'tasks', label: 'Tasks', count: localTasks.length },
                    { id: 'dashboard', label: 'Dashboard' },
                    { id: 'timeline', label: 'Timeline' },
                    { id: 'milestones', label: 'Milestones' },
                    { id: 'activity', label: 'Activity' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                      {tab.count !== undefined && (
                        <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'tasks' && (
                <TasksTab
                  tasks={localTasks}
                  isLoading={projectTasksLoading}
                  projectId={projectId}
                  onTaskUpdate={handleTaskUpdate}
                  onCreateTask={() => setShowCreateTaskModal(true)}
                />
              )}

              {activeTab === 'dashboard' && (
                <DashboardProvider>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <ProjectDashboard projectId={projectId} />
                  </div>
                </DashboardProvider>
              )}

              {activeTab === 'timeline' && (
                <GanttChart tasks={localTasks} project={project} />
              )}

              {activeTab === 'milestones' && (
                <MilestoneTracker project={project} tasks={localTasks} />
              )}

              {activeTab === 'activity' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <ActivityLog projectId={projectId} />
                </div>
              )}
            </div>
          </div>

          {/* Modals */}
          {showCreateTaskModal && (
            <Suspense fallback={<div>Loading modal...</div>}>
              <CreateTaskModal 
                projectId={projectId} 
                closeModal={() => setShowCreateTaskModal(false)}
              />
            </Suspense>
          )}
          
          {showArchiveModal && (
            <EnhancedArchiveModal
              project={project}
              closeModal={() => setShowArchiveModal(false)}
            />
          )}

          <DeleteConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteProject}
            title={`Delete "${project.title}"?`}
            message="This will permanently delete the project and all its tasks, milestones, and data."
            isDeleting={isDeleting}
          />
        </ActivityProvider>
      </div>
    </div>
  );
};

export default ProjectDetails;

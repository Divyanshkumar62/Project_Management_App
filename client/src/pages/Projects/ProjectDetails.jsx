import { useContext, useEffect, lazy, Suspense, useState } from "react";
import { DashboardProvider } from "../../context/DashboardContext";
import ProjectDashboard from "./ProjectDashboard";
import { ActivityProvider } from "../../context/ActivityContext";
import ActivityLog from "./ActivityLog";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import SkeletonTask from "../../components/ui/SkeltonTask";
import { TaskContext } from "../../context/TaskContext";
import { ProjectContext } from "../../context/ProjectContext";
import Sidebar from "../../components/dashboard/Sidebar";

// Lazy load components
const CreateTaskModal = lazy(() =>
  import("../../components/modals/CreateTaskModal")
);
const TaskCard = lazy(() => import("../../components/task/TaskCard"));

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, isProjectOwner, isProjectMember } =
    useContext(ProjectContext);
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

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const reorderedTasks = [...localTasks];
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedTask);
    setLocalTasks(reorderedTasks);

    // Update task status based on position (optional - you can implement status logic here)
    // For now, we'll just update the local state
  };

  if (!project) {
    return <div>Loading project details...</div>;
  }

  if (projectTasksError) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">{project.title}</h1>
        <p className="text-red-500">Error loading tasks for this project.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <ActivityProvider>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
            {/* Project Settings Button (Owner only) */}
            {isProjectOwner(project) && (
              <button
                className="ml-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => navigate(`/projects/${projectId}/settings`)}
              >
                Project Settings
              </button>
            )}
            <p className="text-gray-600">{project.description}</p>
          </div>
          <div className="flex gap-2">
            {/* Only show invitation management buttons to project owners */}
            {isProjectOwner(projectId) && (
              <>
                <button
                  onClick={() => navigate(`/projects/${projectId}/invitations`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  View Invitations
                </button>
                <button
                  onClick={() =>
                    navigate(`/projects/${projectId}/invitations/manage`)
                  }
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Manage Invitations
                </button>
              </>
            )}

            {/* Show delete project button only to owners */}
            {isProjectOwner(projectId) && (
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this project? This action cannot be undone."
                    )
                  ) {
                    // Handle project deletion
                    console.log("Delete project:", projectId);
                  }
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete Project
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b mb-4">
          <button
            className={`pb-2 px-2 border-b-2 transition-colors ${
              activeTab === "tasks"
                ? "border-blue-500 text-blue-600 font-semibold"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab("tasks")}
          >
            Tasks
          </button>
          <button
            className={`pb-2 px-2 border-b-2 transition-colors ${
              activeTab === "dashboard"
                ? "border-blue-500 text-blue-600 font-semibold"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`pb-2 px-2 border-b-2 transition-colors ${
              activeTab === "activity"
                ? "border-blue-500 text-blue-600 font-semibold"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab("activity")}
          >
            Activity Log
          </button>
        </div>

        {/* Tab Content */}
        <DashboardProvider>
          {activeTab === "tasks" &&
            (projectTasksLoading ? (
              <div>
                {[...Array(5)].map((_, index) => (
                  <SkeletonTask key={index} />
                ))}
              </div>
            ) : (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="taskList">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-4"
                    >
                      <Suspense fallback={<SkeletonTask />}>
                        {localTasks && localTasks.length > 0 ? (
                          localTasks.map((task, index) => (
                            <Draggable
                              key={task._id}
                              draggableId={task._id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <TaskCard task={{ ...task, projectId }} />
                                </div>
                              )}
                            </Draggable>
                          ))
                        ) : (
                          <p className="text-gray-500">
                            No tasks found for this project.
                          </p>
                        )}
                      </Suspense>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ))}
          {activeTab === "dashboard" && (
            <div className="mt-4">
              <ProjectDashboard projectId={projectId} />
            </div>
          )}
          {activeTab === "activity" && (
            <div className="mt-4">
              <ActivityLog projectId={projectId} />
            </div>
          )}
        </DashboardProvider>
        <Suspense fallback={<div>Loading modal...</div>}>
          <CreateTaskModal projectId={projectId} />
        </Suspense>
      </div>
        </ActivityProvider>
      </div>
    </div>
  );
};

export default ProjectDetails;

import { useContext, useEffect, lazy, Suspense, useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import SkeletonTask from "../../components/ui/SkeltonTask";
import { TaskContext } from "../../context/TaskContext";
import { ProjectContext } from "../../context/ProjectContext";

// Lazy load components
const CreateTaskModal = lazy(() =>
  import("../../components/modals/CreateTaskModal")
);
const TaskCard = lazy(() => import("../../components/task/TaskCard"));

const ProjectDetails = () => {
  const { projectId } = useParams();
  const { projects } = useContext(ProjectContext);
  const {
    tasks,
    isLoading,
    isError,
    createTaskMutation,
    updateTaskOrder,
    refetch,
  } = useContext(TaskContext);
  const queryClient = useQueryClient();
  const [localTasks, setLocalTasks] = useState([]);
  const [project, setProject] = useState(null);

  useEffect(() => {
    const currentProject = projects.find((p) => p._id === projectId);
    setProject(currentProject);
    queryClient.invalidateQueries(["tasks"]);
  }, [projectId, projects, queryClient]);

  useEffect(() => {
    if (!tasks) {
      setLocalTasks([]);
    } else if (tasks[projectId]) {
      setLocalTasks(tasks[projectId]);
    }
  }, [tasks, projectId]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedTasks = [...localTasks];
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedTask);
    setLocalTasks(reorderedTasks);

    updateTaskOrder(projectId, reorderedTasks);
  };

  if (!project) {
    return <div>Loading project details...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{project.title}</h1>
      <p>{project.description}</p>
      {isLoading ? (
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
                  {localTasks.length > 0 &&
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
                            <TaskCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                </Suspense>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <Suspense fallback={<div>Loading modal...</div>}>
        <CreateTaskModal projectId={projectId} />
      </Suspense>
    </div>
  );
};

export default ProjectDetails;

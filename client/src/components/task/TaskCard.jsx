import React, { useContext, useState } from "react";
import { TaskContext } from "../../context/TaskContext";
import { ProjectContext } from "../../context/ProjectContext";

const TaskCard = ({ task }) => {
  const { removeTaskById } = useContext(TaskContext);
  const { isProjectOwner, isProjectMember } = useContext(ProjectContext);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState("");

  const handleDelete = async () => {
    if (!task.projectId) {
      setMessage("Error: Project ID not found");
      return;
    }

    // Check if user has permission to delete tasks
    if (!isProjectOwner(task.projectId)) {
      setMessage("Error: Only project owners can delete tasks");
      return;
    }

    setIsDeleting(true);
    setMessage("");

    try {
      const result = await removeTaskById(task.projectId, task._id);
      if (result.success) {
        setMessage("Task deleted successfully!");
      } else {
        setMessage(`Error: ${result.error || "Failed to delete task"}`);
      }
    } catch (error) {
      setMessage("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white shadow-lg p-4 rounded-md">
      <h3 className="text-lg font-semibold">{task.title}</h3>
      <p className="text-gray-600">{task.description}</p>

      {task.priority && (
        <p className="text-sm text-gray-500 mt-2">
          Priority: <span className="font-medium">{task.priority}</span>
        </p>
      )}

      {task.status && (
        <p className="text-sm text-gray-500">
          Status: <span className="font-medium">{task.status}</span>
        </p>
      )}

      {message && (
        <div
          className={`mt-2 p-2 rounded text-sm ${
            message.includes("Error") || message.includes("Failed")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="flex justify-between mt-4">
        {/* Only show edit button to project members and owners */}
        {isProjectMember(task.projectId) && (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            disabled={isDeleting}
          >
            Edit
          </button>
        )}

        {/* Only show delete button to project owners */}
        {isProjectOwner(task.projectId) && (
          <button
            className={`px-3 py-1 rounded text-white ${
              isDeleting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;

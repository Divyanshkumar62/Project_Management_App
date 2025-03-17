import React, { useContext } from "react";
import { TaskContext } from "../../context/TaskContext";

const TaskCard = ({ task }) => {
  const { removeTask } = useContext(TaskContext);

  return (
    <div className="bg-white shadow-lg p-4 rounded-md">
      <h3 className="text-lg font-semibold">{task.title}</h3>
      <p className="text-gray-600">{task.description}</p>

      <div className="flex justify-between mt-4">
        <button className="bg-blue-500 text-white px-3 py-1 rounded">
          Edit
        </button>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded"
          onClick={() => removeTask(task.projectId, task._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;

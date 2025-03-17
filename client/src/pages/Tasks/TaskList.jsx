import React, { useContext } from "react";
import { TaskContext } from "../../context/TaskContext";
import TaskCard from "../../components/task/TaskCard";

const TaskList = () => {
  const { userTasks, userLoading, userError } = useContext(TaskContext);

  if (userLoading) return <p>Loading tasks...</p>;
  if (userError) return <p>Error loading tasks.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Tasks</h2>
      {userTasks?.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {userTasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No tasks assigned to you.</p>
      )}
    </div>
  );
};

export default TaskList;

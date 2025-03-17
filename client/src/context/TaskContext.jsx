import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTask,
  fetchTasks,
  updateTask,
  removeTask,
} from "../services/taskService";
import { AuthContext } from "./AuthContext";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { auth } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const {
    data: tasks,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["tasks", auth.token],
    queryFn: async () => fetchTasks(auth.token),
    enabled: !!auth.token,
    staleTime: 1000 * 60 * 5,
  });

  const createTaskMutation = useMutation({
    mutationFn: async (newTask) => {
      console.log("🔹 Creating Task:", newTask);
      return createTask(auth.token, newTask.projectId, newTask);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]); // ✅ Ensure tasks are updated
    },
    onError: (err) => {
      console.error(
        "❌ Task Creation Failed:",
        err.response?.data || err.message
      );
    },
  });

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        isError,
        createTaskMutation, // ✅ Ensure this is correctly passed
        refetch,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);

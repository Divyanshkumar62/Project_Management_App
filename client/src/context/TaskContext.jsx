// Filter & search tasks for a project
const filterTasks = async (projectId, params = {}) => {
  try {
    if (!projectId) return;
    const data = await import("../services/taskService").then((mod) =>
      mod.getProjectTasks(projectId, params)
    );
    // You may want to set a state for filtered tasks, or update projectTasks
    // For now, just return data
    return data;
  } catch (err) {
    console.error("Error filtering tasks:", err);
    return { tasks: [], total: 0 };
  }
};
import { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTask,
  fetchTasks,
  fetchUserTasks,
  updateTask,
  removeTask,
  updateTaskStatus,
} from "../services/taskService";
import { AuthContext } from "./AuthContext";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { auth } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [currentProjectId, setCurrentProjectId] = useState(null);

  // Project-specific tasks query
  const {
    data: projectTasks,
    isLoading: projectTasksLoading,
    isError: projectTasksError,
    refetch: refetchProjectTasks,
  } = useQuery({
    queryKey: ["projectTasks", auth.token, currentProjectId],
    queryFn: async () => {
      if (!currentProjectId) return [];
      return fetchTasks(currentProjectId);
    },
    enabled: !!auth.token && !!currentProjectId,
    staleTime: 1000 * 60 * 5,
  });

  // User tasks query (for general task list)
  const {
    data: userTasks,
    isLoading: userTasksLoading,
    isError: userTasksError,
    refetch: refetchUserTasks,
  } = useQuery({
    queryKey: ["userTasks", auth.token],
    queryFn: async () => fetchUserTasks(),
    enabled: !!auth.token,
    staleTime: 1000 * 60 * 5,
  });

  const createTaskMutation = useMutation({
    mutationFn: async (newTask) => {
      console.log("🔹 Creating Task:", newTask);
      return createTask(newTask.projectId, newTask);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries([
        "projectTasks",
        auth.token,
        variables.projectId,
      ]);
      queryClient.invalidateQueries(["userTasks", auth.token]);
    },
    onError: (err) => {
      console.error(
        "❌ Task Creation Failed:",
        err.response?.data || err.message
      );
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ projectId, taskId, updatedData }) => {
      return updateTask(projectId, taskId, updatedData);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries([
        "projectTasks",
        auth.token,
        variables.projectId,
      ]);
      queryClient.invalidateQueries(["userTasks", auth.token]);
    },
    onError: (err) => {
      console.error(
        "❌ Task Update Failed:",
        err.response?.data || err.message
      );
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async ({ projectId, taskId }) => {
      return removeTask(projectId, taskId);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries([
        "projectTasks",
        auth.token,
        variables.projectId,
      ]);
      queryClient.invalidateQueries(["userTasks", auth.token]);
    },
    onError: (err) => {
      console.error(
        "❌ Task Deletion Failed:",
        err.response?.data || err.message
      );
    },
  });

  const updateTaskStatusMutation = useMutation({
    mutationFn: async ({ projectId, taskId, status }) => {
      return updateTaskStatus(projectId, taskId, status);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries([
        "projectTasks",
        auth.token,
        variables.projectId,
      ]);
      queryClient.invalidateQueries(["userTasks", auth.token]);
    },
    onError: (err) => {
      console.error(
        "❌ Task Status Update Failed:",
        err.response?.data || err.message
      );
    },
  });

  // Helper functions for components
  const loadProjectTasks = (projectId) => {
    setCurrentProjectId(projectId);
  };

  const loadUserTasks = () => {
    // This function triggers a refetch of user tasks
    refetchUserTasks();
  };

  const addTask = async (projectId, taskData) => {
    try {
      await createTaskMutation.mutateAsync({ ...taskData, projectId });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateTaskById = async (projectId, taskId, updatedData) => {
    try {
      await updateTaskMutation.mutateAsync({ projectId, taskId, updatedData });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const removeTaskById = async (projectId, taskId) => {
    try {
      await deleteTaskMutation.mutateAsync({ projectId, taskId });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateTaskStatusById = async (projectId, taskId, status) => {
    try {
      await updateTaskStatusMutation.mutateAsync({ projectId, taskId, status });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <TaskContext.Provider
      value={{
        // Project-specific tasks
        projectTasks,
        projectTasksLoading,
        projectTasksError,
        loadProjectTasks,
        refetchProjectTasks,

        // User tasks (for general task list)
        userTasks,
        userTasksLoading,
        userTasksError,
        loadUserTasks,
        refetchUserTasks,

        // Mutations
        createTaskMutation,
        updateTaskMutation,
        deleteTaskMutation,
        updateTaskStatusMutation,

        // Helper functions
        addTask,
        updateTaskById,
        removeTaskById,
        updateTaskStatusById,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);

import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/tasks";


export const fetchTasks = async (token, projectId) => {
  if(token){
    throw new Error("Unauthorized, no token found!")
  }
  const response = await axios.get(`${API_BASE_URL}/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
 console.log(`service: `,response.data)
  return response.data;
};

export const fetchUserTasks = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateTaskStatus = async (token, taskId, status) => {
  const response = await axios.put(
    `${API_BASE_URL}/${taskId}/status`,
    { status },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const createTask = async (token, projectId, taskData) => {
  if (!token) throw new Error("Unauthorized: No token found.");

  const response = await axios.post(
    `${API_BASE_URL}/${projectId}/tasks`,
    {
      title: taskData.title, // ✅ Ensure correct field names
      description: taskData.description,
      dueDate: taskData.dueDate || new Date().toISOString(), // ✅ Default date
      priority: taskData.priority || "Medium", // ✅ Default priority
      assignedTo: taskData.assignedTo || [], // ✅ Default empty array
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};


export const updateTask = async (token, projectId, updatedData, taskId) => {
  const response = await axios.put(
    `${API_BASE_URL}/${projectId}/tasks/${taskId}`,
    updatedData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const removeTask = async (token, projectId, taskId) => {
  const response = await axios.delete(
    `${API_BASE_URL}/${projectId}/tasks/${taskId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/projects";


export const fetchProjects = async (token) => {
  const response = await axios.get(API_BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchProjectWithTasks = async (token, projectId) => {
  const response = await axios.get(
    `http://localhost:5000/api/projects/${projectId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  // console.log("🔹 API Response in Frontend:", response.data); 

  return response.data;
};

export const createProject = async (token, projectData) => {
    // console.log("Sending Data to API:", projectData);
  const response = await axios.post(API_BASE_URL, projectData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  //  console.log("Project Created Successfully:", response.data);
  return response.data;
};

export const updateProject = async (token, projectId, updatedData) => {
  const response = await axios.put(
    `${API_BASE_URL}/${projectId}`,
    updatedData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const deleteProject = async (token, projectId) => {
  const response = await axios.delete(`${API_BASE_URL}/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

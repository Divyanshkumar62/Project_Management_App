import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import {
  createProject,
  deleteProject,
  fetchProjects,
  updateProject as updateProjectAPI,
} from "../services/projectService";

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const { auth } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await fetchProjects(auth.token);
      setProjects(data);
    } catch (err) {
      console.error("Error Fetching projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.token) {
      loadProjects();
    }
  }, [auth.token]);

  const addProject = async (projectData) => {
    try {
      if (!auth || !auth.token) {
        console.error("Error: User is not authenticated");
        return;
      }
      // console.log("🔹 Sending Request to API with Token:", auth.token);
      // console.log("🔹 Project Data:", projectData);

      const newProject = await createProject(auth.token, projectData);
      setProjects([...projects, newProject]);
    } catch (err) {
      console.error("Error creating project", err);
    }
  };


  const updateProject = async (projectId, updatedData) => {
    try {
      const updatedProject = await updateProjectAPI(
        auth.token,
        projectId,
        updatedData
      ); 

      setProjects((prevProjects) =>
        prevProjects.map((proj) =>
          proj._id === projectId ? updatedProject : proj
        )
      );
    } catch (err) {
      console.error("Error updating project: ", err);
    }
  };


  const removeProject = async (projectId) => {
    try {
      await deleteProject(auth.token, projectId);
      setProjects((prevProject) => (prevProject.filter((proj) => proj._id !== projectId)));
    } catch (err) {
      console.error("Error deleting Project: ", err);
    }
  };

  return (
    <ProjectContext.Provider
      value={{ projects, loading, addProject, updateProject, removeProject }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

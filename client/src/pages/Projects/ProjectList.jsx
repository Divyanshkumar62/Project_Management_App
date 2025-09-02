import React, { useState, useRef, useEffect } from "react";
import ProjectCard from "../../components/project/ProjectCard";
import { useProjects, useDeleteProject } from "../../hooks/useProjects";
import Sidebar from "../../components/dashboard/Sidebar";
import { useLocation } from "react-router-dom";

const DEBOUNCE_MS = 300;

const ProjectList = () => {
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef();
  
  const { data: projects = [], isLoading: loading, error } = useProjects({ q: debouncedSearch });
  const deleteProjectMutation = useDeleteProject();

  // Check if we're on the dashboard route (rendered inside MainContent)
  const isInDashboard = location.pathname === '/dashboard';

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, DEBOUNCE_MS);

    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const handleDeleteProject = (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProjectMutation.mutate(projectId);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Error loading projects: {error.message}</div>
      </div>
    );
  }

  if (isInDashboard) {
    // Render without sidebar and search bar when inside Dashboard
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            onDelete={handleDeleteProject}
            onUpdate={() => {}}
          />
        ))}
      </div>
    );
  }

  // Render with sidebar when accessed directly
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onDelete={handleDeleteProject}
                onUpdate={() => {}}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectList;

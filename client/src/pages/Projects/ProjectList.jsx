import React, { useContext, useEffect, useState } from "react";
import ProjectCard from "../../components/project/ProjectCard";
import { ProjectContext } from "../../context/ProjectContext";

const ProjectList = () => {
  const { projects, loading } = useContext(ProjectContext);

  return (
    <div className="p-4">
      {loading ? (
        <p>Loading projects...</p>
      ) : (projects && projects.length === 0) ? (
        <p>No Projects Found. Start by creating one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;

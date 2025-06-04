import React, { useState, useContext, useEffect, useRef } from "react";
import { ProjectContext } from "../../context/ProjectContext";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa";
import CreateTaskModal from "../../components/modals/CreateTaskModal";
import UpdateProjectModal from "../../components/modals/UpdateProjectModal"; // ✅ Import Update Modal
import { fetchProjectWithTasks } from "../../services/projectService";

const ProjectCard = ({ project }) => {
  const { removeProject } = useContext(ProjectContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // ✅ State for update modal
  const [projectTasks, setProjectTasks] = useState([]);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchProjectWithTasks(
          localStorage.getItem("token"),
          project._id
        );
        setProjectTasks(data.tasks || []);
      } catch (err) {
        console.error("❌ Error fetching tasks:", err);
      }
    };
    loadTasks();
  }, [project._id]);

  const handleAddTask = () => {
    setIsTaskModalOpen(true);
  };

  return (
    <div ref={menuRef} className="bg-white p-4 shadow rounded relative">
      {/* Project Title & 3-Dot Menu */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">{project.title}</h3>

        {/* 3-dot Menu */}
        <div className="relative">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <FaEllipsisV size={18} className="cursor-pointer text-gray-600" />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md p-2">
              <button
                className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                onClick={() => navigate(`/projects/${project._id}`)}
              >
                View Details
              </button>
              <button
                className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                onClick={handleAddTask}
              >
                Create Task
              </button>
              <button
                className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                onClick={() => setIsUpdateModalOpen(true)} // ✅ Open Update Modal
              >
                Update Project
              </button>
              <button
                className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100"
                onClick={() => removeProject(project._id)}
              >
                Remove Project
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Task List */}
      <div className="mt-3">
        {projectTasks && projectTasks.length > 0 ? (
          <ul className="list-disc pl-5 text-gray-700">
            {projectTasks.map((task) => (
              <li key={task._id} className="py-1">
                {task.title}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No tasks yet.</p>
        )}
      </div>

      {/* Modals */}
      {isTaskModalOpen && (
        <CreateTaskModal
          projectId={project._id}
          closeModal={() => setIsTaskModalOpen(false)}
        />
      )}
      {isUpdateModalOpen && (
        <UpdateProjectModal
          project={project}
          closeModal={() => setIsUpdateModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProjectCard;

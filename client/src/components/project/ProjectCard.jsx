import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa";
import CreateTaskModal from "../../components/modals/CreateTaskModal";
import UpdateProjectModal from "../../components/modals/UpdateProjectModal";
import ProjectDetailsModal from "../../components/modals/ProjectDetailsModal";
import { useTasks } from "../../hooks/useTasks";

const ProjectCard = ({ project, onDelete, onUpdate }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const menuRef = useRef(null);

  // Fetch tasks using React Query
  const { data: projectTasks = [], isLoading: tasksLoading, error: tasksError } = useTasks(project._id);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddTask = () => {
    setIsTaskModalOpen(true);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">{project.title}</h3>

        <div className="relative">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <FaEllipsisV size={18} className="cursor-pointer text-gray-600" />
          </button>
          {isMenuOpen && (
            <div
              ref={menuRef}
              className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md p-2 z-40"
              style={{ zIndex: 40 }}
            >
              <button
                className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                onClick={() => {
                  setIsDetailsModalOpen(true);
                  setIsMenuOpen(false);
                }}
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
                onClick={() => setIsUpdateModalOpen(true)}
              >
                Update Project
              </button>
              <button
                className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100"
                onClick={() => {
                  onDelete();
                  setIsMenuOpen(false);
                }}
              >
                Remove Project
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-gray-600 mt-2">{project.description}</p>
      
      <div className="mt-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          project.status === 'Completed' ? 'bg-green-100 text-green-800' :
          project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
          project.status === 'Planning' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {project.status}
        </span>
      </div>

      {/* Task List */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Tasks ({tasksLoading ? '...' : projectTasks.length})
        </h4>
        {tasksLoading ? (
          <p className="text-gray-400 text-sm">Loading tasks...</p>
        ) : projectTasks && projectTasks.length > 0 ? (
          <ul className="space-y-1">
            {projectTasks.slice(0, 2).map((task) => (
              <li key={task._id} className="text-sm text-gray-600 flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  task.status === 'Completed' ? 'bg-green-500' :
                  task.status === 'In Progress' ? 'bg-blue-500' :
                  'bg-gray-400'
                }`}></span>
                {task.title}
              </li>
            ))}
            {projectTasks.length > 2 && (
              <li className="text-xs text-gray-500">
                +{projectTasks.length - 2} more tasks
              </li>
            )}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">No tasks yet.</p>
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
          onUpdate={onUpdate}
        />
      )}
      {isDetailsModalOpen && (
        <ProjectDetailsModal
          project={project}
          closeModal={() => setIsDetailsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProjectCard;

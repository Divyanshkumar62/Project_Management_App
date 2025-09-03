import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import ProjectCard from "../../components/project/ProjectCard";
import { useProjects, useDeleteProject } from "../../hooks/useProjects";
import Sidebar from "../../components/dashboard/Sidebar";
import { useLocation } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";

const ProjectList = ({ searchQuery, sortBy: propSortBy, sortOrder: propSortOrder }) => {
  const location = useLocation();
  const [localSearch, setLocalSearch] = useState("");
  const [localSortBy, setLocalSortBy] = useState("createdAt");
  const [localSortOrder, setLocalSortOrder] = useState("desc");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const debouncedLocalSearch = useDebounce(localSearch, 300);
  
  useEffect(() => {
    console.log('ProjectList re-rendered with showDeleteModal:', showDeleteModal);
  }, [showDeleteModal]);
  
  // Use props from dashboard or local state for direct access
  const finalSearchQuery = searchQuery !== undefined ? searchQuery : debouncedLocalSearch;
  const finalSortBy = propSortBy !== undefined ? propSortBy : localSortBy;
  const finalSortOrder = propSortOrder !== undefined ? propSortOrder : localSortOrder;
  
  const { data: projects = [], isLoading: loading, error } = useProjects({ 
    q: finalSearchQuery,
    sortBy: finalSortBy,
    sortOrder: finalSortOrder
  });
  const deleteProjectMutation = useDeleteProject();

  const isInDashboard = location.pathname === '/dashboard';

  // Client-side sorting as fallback
  const sortedProjects = [...projects].sort((a, b) => {
    let aValue, bValue;
    
    switch (finalSortBy) {
      case 'title':
        aValue = a.title?.toLowerCase() || '';
        bValue = b.title?.toLowerCase() || '';
        break;
      case 'status':
        aValue = a.status || '';
        bValue = b.status || '';
        break;
      case 'updatedAt':
        aValue = new Date(a.updatedAt || a.createdAt);
        bValue = new Date(b.updatedAt || b.createdAt);
        break;
      default: // createdAt
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
    }

    if (finalSortBy === 'title' || finalSortBy === 'status') {
      return finalSortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    } else {
      return finalSortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
  });

  const handleDeleteProject = (projectId) => {
    console.log('handleDeleteProject called with:', projectId);
    setProjectToDelete(projectId);
    setShowDeleteModal(true);
    console.log('Modal state set:', { projectToDelete: projectId, showDeleteModal: true });
  };

  const confirmDelete = () => {
    console.log('confirmDelete called with projectToDelete:', projectToDelete);
    if (projectToDelete) {
      deleteProjectMutation.mutate(projectToDelete);
      setShowDeleteModal(false);
      setProjectToDelete(null);
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
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProjects.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              {finalSearchQuery ? "No projects found matching your search." : "No projects yet. Create your first project!"}
            </div>
          ) : (
            sortedProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onDelete={() => handleDeleteProject(project._id)}
                onUpdate={() => {}}
              />
            ))
          )}
        </div>
        
        {/* Delete Confirmation Modal */}
        {showDeleteModal && ReactDOM.createPortal(
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '8px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)'
            }}>
              <h3 style={{ color: 'red', marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
                Delete Project
              </h3>
              <p style={{ marginBottom: '24px', color: '#374151' }}>
                Are you sure you want to delete this project? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={confirmDelete}
                  style={{
                    flex: 1,
                    backgroundColor: '#ef4444',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Delete Project
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    flex: 1,
                    backgroundColor: '#6b7280',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">My Projects</h1>
            
            {/* Search and Sort Controls */}
            <div className="flex flex-wrap gap-4 mb-6">
              <input
                type="text"
                placeholder="Search projects..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="flex-1 min-w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <select
                value={localSortBy}
                onChange={(e) => setLocalSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt">Date Created</option>
                <option value="updatedAt">Last Updated</option>
                <option value="title">Name</option>
                <option value="status">Status</option>
              </select>
              
              <select
                value={localSortOrder}
                onChange={(e) => setLocalSortOrder(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProjects.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                {finalSearchQuery ? "No projects found matching your search." : "No projects yet. Create your first project!"}
              </div>
            ) : (
              sortedProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onDelete={() => handleDeleteProject(project._id)}
                  onUpdate={() => {}}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (() => {
        alert('Modal should be showing now!');
        return ReactDOM.createPortal(
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '8px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
              border: '3px solid red'
            }}>
              <h3 style={{ color: 'red', marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
                Delete Project
              </h3>
              <p style={{ marginBottom: '24px', color: '#374151' }}>
                Are you sure you want to delete this project? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={confirmDelete}
                  style={{
                    flex: 1,
                    backgroundColor: '#ef4444',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Delete Project
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    flex: 1,
                    backgroundColor: '#6b7280',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>,
          document.body
        );
      })()}

    </div>
  );
};

export default ProjectList;

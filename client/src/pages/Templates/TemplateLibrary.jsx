import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import CreateTemplateModal from '../../components/modals/CreateTemplateModal';
import { useDebounce } from '../../hooks/useDebounce';
import * as templateService from '../../services/templateService';
import * as projectService from '../../services/projectService';
import * as taskService from '../../services/taskService';

const TemplateLibrary = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const debouncedSearch = useDebounce(search, 300);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch templates
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['templates', debouncedSearch, category],
    queryFn: () => templateService.getTemplates({
      search: debouncedSearch,
      category: category
    })
  });

  // Create project from template
  const createProjectMutation = useMutation({
    mutationFn: ({ templateId, projectData }) =>
      templateService.createProjectFromTemplate(templateId, projectData),
    onSuccess: (project) => {
      queryClient.invalidateQueries(['projects']);
      queryClient.invalidateQueries(['templates']);
      navigate(`/projects/${project._id}`);
    }
  });

  const handleUseTemplate = (template) => {
    const projectData = {
      title: `${template.name} Project`,
      description: template.description,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + template.defaultDuration * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    
    createProjectMutation.mutate({ templateId: template._id, projectData });
  };

  const categories = ['Software', 'Marketing', 'Design', 'Research', 'Operations', 'Other'];

  // Predefined templates if none exist
  const predefinedTemplates = [
    {
      _id: 'predefined-1',
      name: 'Website Development',
      description: 'Complete website development project with design, development, and deployment phases',
      category: 'Software',
      defaultDuration: 45,
      usageCount: 0,
      createdBy: { name: 'System' },
      tasks: [
        { title: 'Requirements Gathering', description: 'Collect and document project requirements', priority: 'High', estimatedDays: 3 },
        { title: 'UI/UX Design', description: 'Create wireframes and design mockups', priority: 'High', estimatedDays: 7 },
        { title: 'Frontend Development', description: 'Implement user interface', priority: 'Medium', estimatedDays: 15 },
        { title: 'Backend Development', description: 'Develop server-side functionality', priority: 'Medium', estimatedDays: 12 },
        { title: 'Testing & QA', description: 'Test functionality and fix bugs', priority: 'High', estimatedDays: 5 },
        { title: 'Deployment', description: 'Deploy to production environment', priority: 'Medium', estimatedDays: 3 }
      ]
    },
    {
      _id: 'predefined-2',
      name: 'Marketing Campaign',
      description: 'Comprehensive marketing campaign from planning to execution',
      category: 'Marketing',
      defaultDuration: 30,
      usageCount: 0,
      createdBy: { name: 'System' },
      tasks: [
        { title: 'Market Research', description: 'Research target audience and competitors', priority: 'High', estimatedDays: 5 },
        { title: 'Campaign Strategy', description: 'Develop campaign strategy and messaging', priority: 'High', estimatedDays: 3 },
        { title: 'Content Creation', description: 'Create marketing materials and content', priority: 'Medium', estimatedDays: 10 },
        { title: 'Campaign Launch', description: 'Execute campaign across channels', priority: 'High', estimatedDays: 2 },
        { title: 'Performance Monitoring', description: 'Track and analyze campaign performance', priority: 'Medium', estimatedDays: 10 }
      ]
    },
    {
      _id: 'predefined-3',
      name: 'Mobile App Development',
      description: 'End-to-end mobile application development project',
      category: 'Software',
      defaultDuration: 60,
      usageCount: 0,
      createdBy: { name: 'System' },
      tasks: [
        { title: 'App Concept & Planning', description: 'Define app concept and create project plan', priority: 'High', estimatedDays: 5 },
        { title: 'UI/UX Design', description: 'Design app interface and user experience', priority: 'High', estimatedDays: 10 },
        { title: 'Frontend Development', description: 'Develop app frontend', priority: 'Medium', estimatedDays: 20 },
        { title: 'Backend Development', description: 'Develop server-side components', priority: 'Medium', estimatedDays: 15 },
        { title: 'Testing', description: 'Test app functionality and performance', priority: 'High', estimatedDays: 7 },
        { title: 'App Store Submission', description: 'Submit app to app stores', priority: 'Medium', estimatedDays: 3 }
      ]
    }
  ];

  const displayTemplates = templates.length > 0 ? templates : predefinedTemplates;

  const handleUsePredefinedTemplate = async (template) => {
    try {
      // Create project using service
      const projectData = {
        title: `${template.name} Project`,
        description: template.description,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + template.defaultDuration * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };

      const project = await projectService.createProject(projectData);

      // Create tasks for the project
      const taskPromises = template.tasks.map(async (templateTask, index) => {
        const taskStartDate = new Date(projectData.startDate);
        taskStartDate.setDate(taskStartDate.getDate() + (index * 2));

        const taskData = {
          title: templateTask.title,
          description: templateTask.description,
          priority: templateTask.priority,
          dueDate: new Date(taskStartDate.getTime() + (templateTask.estimatedDays * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
        };

        return taskService.createTask(project._id, taskData);
      });

      await Promise.all(taskPromises);

      // Show success message
      alert(`✅ Template "${template.name}" selected successfully!\n\nYour new project has been created. You can view it under "Projects" in the sidebar.`);

      // Update queries and navigate
      queryClient.invalidateQueries(['projects']);
      navigate(`/projects/${project._id}`)
    } catch (error) {
      alert('❌ Error creating project. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Templates</h1>
            
            {/* Search and Filters */}
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Create Template
              </button>
            </div>
          </div>

          {/* Templates Grid */}
          {isLoading ? (
            <div className="text-center py-12">Loading templates...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayTemplates.map((template) => (
                <div key={template._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                        {template.category}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {template.usageCount} uses
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{template.description}</p>
                  
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-2">
                      {template.tasks.length} tasks • {template.defaultDuration} days
                    </div>
                    <div className="text-xs text-gray-400">
                      By {template.createdBy.name}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => template._id.startsWith('predefined') ? 
                      handleUsePredefinedTemplate(template) : 
                      handleUseTemplate(template)
                    }
                    disabled={createProjectMutation.isLoading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    {createProjectMutation.isLoading ? 'Creating...' : 'Use Template'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Template Modal */}
      {showCreateModal && (
        <CreateTemplateModal closeModal={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

export default TemplateLibrary;

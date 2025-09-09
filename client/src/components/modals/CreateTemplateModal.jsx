import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FaTimes } from 'react-icons/fa';
import * as templateService from '../../services/templateService';

const CreateTemplateModal = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Software',
    defaultDuration: 30,
    isPublic: false,
    tasks: [{ title: '', description: '', priority: 'Medium', estimatedDays: 1 }]
  });
  const queryClient = useQueryClient();

  const createTemplateMutation = useMutation({
    mutationFn: (templateData) => templateService.createTemplate(templateData),
    onSuccess: () => {
      queryClient.invalidateQueries(['templates']);
      closeModal();
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createTemplateMutation.mutate(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addTask = () => {
    setFormData(prev => ({
      ...prev,
      tasks: [...prev.tasks, { title: '', description: '', priority: 'Medium', estimatedDays: 1 }]
    }));
  };

  const updateTask = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.map((task, i) => 
        i === index ? { ...task, [field]: value } : task
      )
    }));
  };

  const removeTask = (index) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Create Project Template</h2>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Template Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Software">Software</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Design">Design</option>
                  <option value="Research">Research</option>
                  <option value="Operations">Operations</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Default Duration (days)</label>
                <input
                  type="number"
                  name="defaultDuration"
                  value={formData.defaultDuration}
                  onChange={handleChange}
                  min="1"
                  max="365"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Make template public
                </label>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Template Tasks</h3>
                <button
                  type="button"
                  onClick={addTask}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                >
                  Add Task
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.tasks.map((task, index) => (
                  <div key={index} className="border p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <input
                        type="text"
                        placeholder="Task title"
                        value={task.title}
                        onChange={(e) => updateTask(index, 'title', e.target.value)}
                        className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <div className="flex gap-2">
                        <select
                          value={task.priority}
                          onChange={(e) => updateTask(index, 'priority', e.target.value)}
                          className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                        <input
                          type="number"
                          placeholder="Days"
                          value={task.estimatedDays}
                          onChange={(e) => updateTask(index, 'estimatedDays', parseInt(e.target.value))}
                          min="1"
                          className="w-20 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeTask(index)}
                          className="text-red-500 hover:text-red-700 px-2"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    <textarea
                      placeholder="Task description"
                      value={task.description}
                      onChange={(e) => updateTask(index, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={createTemplateMutation.isLoading}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {createTemplateMutation.isLoading ? 'Creating...' : 'Create Template'}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTemplateModal;

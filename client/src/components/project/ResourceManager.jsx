import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaUsers, FaCalendar, FaClock, FaPlus, FaEdit, FaTrash, FaCheck, FaUser } from 'react-icons/fa';
import * as resourceService from '../../services/resourceService';

const ResourceManager = ({ project }) => {
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState(null);
  const [allocationData, setAllocationData] = useState({
    hoursAllocated: 20,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  const queryClient = useQueryClient();

  // Fetch project resources
  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['projectResources', project?._id],
    queryFn: () => resourceService.getProjectResources(project._id),
    enabled: !!project?._id
  });

  // Get user profile mutation
  const getProfileMutation = useQuery({
    queryKey: ['userResourceProfile'],
    queryFn: () => resourceService.getUserResourceProfile(),
    enabled: showAllocateModal
  });

  // Allocate resource mutation
  const allocateMutation = useMutation({
    mutationFn: (data) => resourceService.allocateResource(project._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['projectResources', project._id]);
      setShowAllocateModal(false);
      setAllocationData({
        hoursAllocated: 20,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    },
    onError: (error) => {
      alert('Failed to allocate resource: ' + (error.message || 'Please try again'));
    }
  });

  // Update allocation mutation
  const updateMutation = useMutation({
    mutationFn: ({ allocationId, data }) =>
      resourceService.updateAllocation(project._id, allocationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['projectResources', project._id]);
      setEditingAllocation(null);
    },
    onError: (error) => {
      alert('Failed to update allocation: ' + (error.message || 'Please try again'));
    }
  });

  // Remove allocation mutation
  const removeMutation = useMutation({
    mutationFn: (allocationId) => resourceService.removeAllocation(allocationId),
    onSuccess: () => {
      queryClient.invalidateQueries(['projectResources', project._id]);
    },
    onError: (error) => {
      alert('Failed to remove allocation: ' + (error.message || 'Please try again'));
    }
  });

  const handleAllocate = (e) => {
    e.preventDefault();
    allocateMutation.mutate({
      hoursAllocated: allocationData.hoursAllocated,
      startDate: new Date(allocationData.startDate).toISOString(),
      endDate: new Date(allocationData.endDate).toISOString()
    });
  };

  const handleUpdate = (allocationId, data) => {
    updateMutation.mutate({ allocationId, data });
  };

  const handleRemove = (allocationId) => {
    if (window.confirm('Are you sure you want to remove this allocation?')) {
      removeMutation.mutate(allocationId);
    }
  };

  // Calculate total allocated hours for the project
  const totalAllocatedHours = resources.reduce((total, resource) => {
    return total + resource.allocations
      .filter(a => a.status === 'Active')
      .reduce((sum, a) => sum + a.hoursAllocated, 0);
  }, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FaUsers className="text-blue-500" />
            Resource Management
          </h3>
          <div className="text-sm text-gray-600 mt-1">
            Total Allocated: {totalAllocatedHours} hours/week
          </div>
        </div>
        <button
          onClick={() => setShowAllocateModal(true)}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center gap-2 disabled:opacity-50"
        >
          <FaPlus size={12} />
          Allocate Myself
        </button>
      </div>

      {/* Resources List */}
      {isLoading ? (
        <div className="text-center py-8">Loading resources...</div>
      ) : resources.length === 0 ? (
        <div className="text-center py-12">
          <FaUsers size={48} className="mx-auto text-gray-300 mb-4" />
          <h4 className="text-lg font-medium text-gray-600 mb-2">No Resources Allocated</h4>
          <p className="text-gray-500 mb-4">Allocate team members to this project to track their capacity</p>
          <button
            onClick={() => setShowAllocateModal(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Allocate First Resource
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {resources.map((resource) => {
            const activeAllocations = resource.allocations.filter(a => a.status === 'Active');

            return (
              <div key={resource.user._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaUser className="text-blue-600" size={16} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{resource.user.name}</h4>
                      <div className="text-sm text-gray-500">
                        Capacity: {resource.capacity} hours/week
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {activeAllocations.reduce((sum, a) => sum + a.hoursAllocated, 0)} hours allocated
                  </div>
                </div>

                <div className="space-y-2">
                  {activeAllocations.map((allocation) => (
                    <div key={allocation._id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-700">
                            {allocation.hoursAllocated} hours/week
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1">
                              <FaCalendar size={10} />
                              {new Date(allocation.startDate).toLocaleDateString()} - {new Date(allocation.endDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingAllocation(allocation)}
                            className="text-blue-500 hover:text-blue-700 text-xs"
                          >
                            <FaEdit size={12} />
                          </button>
                          <button
                            onClick={() => handleRemove(allocation._id)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Allocation Modal */}
      {showAllocateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaPlus className="text-blue-500" />
              Allocate Resources
            </h3>

            <form onSubmit={handleAllocate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hours per Week *
                </label>
                <input
                  type="number"
                  min="1"
                  max={getProfileMutation.data?.capacity || 40}
                  value={allocationData.hoursAllocated}
                  onChange={(e) => setAllocationData({ ...allocationData, hoursAllocated: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                  <input
                    type="date"
                    value={allocationData.startDate}
                    onChange={(e) => setAllocationData({ ...allocationData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                  <input
                    type="date"
                    value={allocationData.endDate}
                    onChange={(e) => setAllocationData({ ...allocationData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min={allocationData.startDate}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={allocateMutation.isLoading}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {allocateMutation.isLoading ? 'Allocating...' : 'Allocate'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAllocateModal(false)}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Allocation Modal */}
      {editingAllocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaEdit className="text-blue-500" />
              Edit Allocation
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hours per Week</label>
                <input
                  type="number"
                  min="1"
                  max="80"
                  value={editingAllocation.hoursAllocated}
                  onChange={(e) => setEditingAllocation({ ...editingAllocation, hoursAllocated: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleUpdate(editingAllocation._id, {
                    hoursAllocated: editingAllocation.hoursAllocated
                  })}
                  disabled={updateMutation.isLoading}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {updateMutation.isLoading ? 'Updating...' : 'Update'}
                </button>
                <button
                  onClick={() => setEditingAllocation(null)}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceManager;

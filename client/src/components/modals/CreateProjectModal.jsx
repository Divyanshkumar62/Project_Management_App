import React, { useState, useRef, useEffect } from "react";
import { useCreateProject } from "../../hooks/useProjects";
import { searchUsers } from "../../services/authService";

const CreateProjectModal = ({ closeModal }) => {
  const createProjectMutation = useCreateProject();
  const modalRef = useRef(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("Planning"); // Default status
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeModal]);

  // 🔹 Fetch users when typing in the search box
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 1) {
      try {
        const results = await searchUsers(value);
        setSearchResults(results);
      } catch (err) {
        console.error("❌ Error searching users:", err);
      }
    } else {
      setSearchResults([]);
    }
  };

  // 🔹 Add user to selected members
  const handleAddMember = (user) => {
    if (!selectedMembers.some((member) => member._id === user._id)) {
      setSelectedMembers([...selectedMembers, user]);
    }
    setSearchTerm(""); // Clear search field after selection
    setSearchResults([]);
  };

  // 🔹 Remove user from selected members
  const handleRemoveMember = (userId) => {
    setSelectedMembers(
      selectedMembers.filter((member) => member._id !== userId)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createProjectMutation.mutateAsync({
        title,
        description,
        startDate,
        endDate: endDate || null, // Allow null endDate
        teamMembers: selectedMembers.map((member) => member._id), // Send only user IDs
        status,
      });

      closeModal(); // ✅ Close modal after creating project
    } catch (err) {
      console.error("❌ Project Creation Failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white p-4 sm:p-6 rounded-md shadow-lg w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto" ref={modalRef}>
        <h2 className="text-lg sm:text-xl font-bold mb-4">Create Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Title */}
          <input
            type="text"
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 sm:p-3 rounded text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />

          {/* Project Description */}
          <textarea
            placeholder="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 sm:p-3 rounded text-sm sm:text-base min-h-[80px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />

          {/* Start Date */}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border p-2 sm:p-3 rounded text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />

          {/* End Date (Optional) */}
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border p-2 sm:p-3 rounded text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {/* Project Status Dropdown */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border p-2 sm:p-3 rounded text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Planning">Planning</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Archived">Archived</option>
          </select>

          {/* 🔹 Team Member Search */}
          <input
            type="text"
            placeholder="Search Team Members..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full border p-2 sm:p-3 rounded text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {/* 🔹 Search Results */}
          {searchResults.length > 0 && (
            <div className="bg-gray-100 p-2 rounded mt-2 max-h-32 overflow-y-auto">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  className="flex flex-col sm:flex-row justify-between p-2 hover:bg-gray-200 cursor-pointer rounded text-sm"
                  onClick={() => handleAddMember(user)}
                >
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs sm:text-sm text-gray-500">{user.email}</span>
                </div>
              ))}
            </div>
          )}
          {/* 🔹 Selected Members */}
          <div className="mt-3">
            {selectedMembers.map((member) => (
              <div
                key={member._id}
                className="flex justify-between items-center p-2 bg-gray-200 rounded mt-1 text-sm"
              >
                <span className="truncate mr-2">{member.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveMember(member._id)}
                  className="text-red-500 text-xs sm:text-sm hover:text-red-700 flex-shrink-0"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="w-full sm:w-auto bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              disabled={createProjectMutation.isLoading}
            >
              {createProjectMutation.isLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;

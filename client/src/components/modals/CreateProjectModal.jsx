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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-1/3" ref={modalRef}>
        <h2 className="text-xl font-bold mb-4">Create Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Title */}
          <input
            type="text"
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

          {/* Project Description */}
          <textarea
            placeholder="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

          {/* Start Date */}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

          {/* End Date (Optional) */}
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border p-2 rounded"
          />

          {/* Project Status Dropdown */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border p-2 rounded"
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
            className="w-full border p-2 rounded"
          />
          {/* 🔹 Search Results */}
          {searchResults.length > 0 && (
            <div className="bg-gray-100 p-2 rounded mt-2">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  className="flex justify-between p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleAddMember(user)}
                >
                  <span>{user.name}</span>
                  <span className="text-sm text-gray-500">{user.email}</span>
                </div>
              ))}
            </div>
          )}
          {/* 🔹 Selected Members */}
          <div className="mt-3">
            {selectedMembers.map((member) => (
              <div
                key={member._id}
                className="flex justify-between items-center p-2 bg-gray-200 rounded mt-1"
              >
                <span>{member.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveMember(member._id)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;

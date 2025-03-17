import React, { useState, useContext, useRef, useEffect } from "react";
import { TaskContext } from "../../context/TaskContext";
import { searchUsers } from "../../services/authService";

const CreateTaskModal = ({ projectId, closeModal }) => {
  const { createTaskMutation } = useContext(TaskContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [assignedTo, setAssignedTo] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeModal]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 1) {
      try {
        const results = await searchUsers(value);
        setSearchResults(results || []); 
      } catch (err) {
        console.error("❌ Error searching users:", err);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleAssignUser = (user) => {
    setAssignedTo(user);
    setSearchTerm(""); 
    setSearchResults([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createTaskMutation.mutateAsync({
        projectId,
        title,
        description,
        priority,
        assignedTo: assignedTo ? assignedTo._id : null,
      });

      closeModal(); 
    } catch (err) {
      console.error(
        "❌ Task Creation Failed:",
        err.response?.data || err.message
      );
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-white p-6 rounded-md shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Create Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Title */}
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

          {/* Task Description */}
          <textarea
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

          {/* Priority Dropdown */}
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          {/* 🔹 Assigned User Search */}
          <input
            type="text"
            placeholder="Search for User..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full border p-2 rounded"
          />

          {/* 🔹 Search Results */}
          {searchResults.length > 0 && (
            <div className="bg-gray-100 p-2 rounded mt-2 max-h-40 overflow-y-auto">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  className="flex justify-between p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleAssignUser(user)}
                >
                  <span>{user.name}</span>
                  <span className="text-sm text-gray-500">{user.email}</span>
                </div>
              ))}
            </div>
          )}

          {/* 🔹 Selected User */}
          {assignedTo && (
            <div className="mt-3 bg-gray-200 p-2 rounded flex justify-between">
              <span>{assignedTo.name}</span>
              <button
                type="button"
                onClick={() => setAssignedTo(null)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            </div>
          )}

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

export default CreateTaskModal;

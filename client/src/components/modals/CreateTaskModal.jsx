import React, { useState, useRef, useEffect } from "react";
import { useCreateTask } from "../../hooks/useTasks";
import { searchUsers } from "../../services/authService";

const CreateTaskModal = ({ projectId, closeModal }) => {
  const createTaskMutation = useCreateTask();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [assignedTo, setAssignedTo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
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

    if (!title.trim()) {
      setMessage("Task title is required");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await createTaskMutation.mutateAsync({
        projectId,
        taskData: {
          title,
          description,
          priority,
          assignedTo: assignedTo ? assignedTo._id : null,
        }
      });

      setMessage("Task created successfully!");
      setTimeout(() => {
        closeModal();
      }, 1000);
    } catch (err) {
      setMessage(`Error: ${err.message || "Failed to create task"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white p-4 sm:p-6 rounded-md shadow-lg w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Create New Task</h2>
        
        {message && (
          <div className={`mb-4 p-3 rounded ${
            message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              rows="3"
              placeholder="Enter task description"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign To
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder="Search users to assign..."
            />
            
            {searchResults.length > 0 && (
              <div className="mt-2 border border-gray-300 rounded-md max-h-32 overflow-y-auto">
                {searchResults.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleAssignUser(user)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {user.name} ({user.email})
                  </div>
                ))}
              </div>
            )}
            
            {assignedTo && (
              <div className="mt-2 p-2 bg-blue-100 rounded-md">
                Assigned to: {assignedTo.name} ({assignedTo.email})
                <button
                  type="button"
                  onClick={() => setAssignedTo(null)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              type="button"
              onClick={closeModal}
              className="w-full sm:w-auto px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;

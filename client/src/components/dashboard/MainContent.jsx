import React, { useState } from "react";
import ProjectList from "../../pages/Projects/ProjectList";
import CreateProjectModal from "../modals/CreateProjectModal";
import { useDebounce } from "../../hooks/useDebounce";

const MainContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const debouncedSearch = useDebounce(search, 300);

  return (
    <main className="flex-1 p-4 bg-[#f8fafb] rounded-tl-2xl rounded-bl-2xl">
      <div className="flex justify-between mb-4">
        <input
          type="search"
          placeholder="Search a Project"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-b-2 focus:border-none border-blue-500 p-2 rounded-md focus:outline-1 focus:outline-blue-600 bg-transparent outline-none transition-all delay-300 ease-in-out"
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white py-2 px-4 cursor-pointer rounded-md"
        >
          + New Project
        </button>
      </div>
      <div className="mt-12">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold mb-2">My Projects</h2>
          <div className="flex items-center gap-2 mb-4">
            <span className="mr-2">Sort by:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border p-1 rounded focus:border-blue-500"
            >
              <option value="createdAt">Date Created</option>
              <option value="updatedAt">Last Updated</option>
              <option value="title">Name</option>
              <option value="status">Status</option>
            </select>
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border p-1 rounded focus:border-blue-500"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
        <ProjectList searchQuery={debouncedSearch} sortBy={sortBy} sortOrder={sortOrder} />
      </div>
      {isModalOpen && (
        <CreateProjectModal closeModal={() => setIsModalOpen(false)} />
      )}
    </main>
  );
};

export default MainContent;

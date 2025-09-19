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
    <main className="flex-1 p-3 sm:p-4 lg:p-6 bg-[#f8fafb] lg:rounded-tl-2xl lg:rounded-bl-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
        <input
          type="search"
          placeholder="Search a Project"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-auto sm:min-w-[250px] border-b-2 focus:border-none border-blue-500 p-2 rounded-md focus:outline-1 focus:outline-blue-600 bg-transparent outline-none transition-all delay-300 ease-in-out"
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-blue-500 text-white py-2 px-4 cursor-pointer rounded-md hover:bg-blue-600 transition-colors font-medium"
        >
          + New Project
        </button>
      </div>
      <div className="mt-6 sm:mt-8 lg:mt-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-3 lg:gap-0">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">My Projects</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4 w-full lg:w-auto">
            <span className="text-sm sm:text-base mr-2">Sort by:</span>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto border p-1 rounded focus:border-blue-500 text-sm"
              >
                <option value="createdAt">Date Created</option>
                <option value="updatedAt">Last Updated</option>
                <option value="title">Name</option>
                <option value="status">Status</option>
              </select>
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full sm:w-auto border p-1 rounded focus:border-blue-500 text-sm"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
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

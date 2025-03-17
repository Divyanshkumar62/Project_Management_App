// src/components/dashboard/MainContent.jsx
import React, { useState } from "react";
import ProjectList from "../../pages/Projects/ProjectList";
import CreateProjectModal from "../modals/CreateProjectModal";

const MainContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <main className="flex-1 p-4 bg-[#f8fafb] rounded-tl-2xl rounded-bl-2xl">
      <div className="flex justify-between mb-4">
        <input
          type="search"
          placeholder="Search a Project"
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
          <div className="flex items-center mb-4">
            <span className="mr-2">Sort by:</span>
            <select className="border p-1 rounded  focus:border-blue-500">
              <option value="date">Date</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
        <ProjectList />
      </div>
      {isModalOpen && (
        <CreateProjectModal closeModal={() => setIsModalOpen(false)} />
      )}
    </main>
  );
};

export default MainContent;

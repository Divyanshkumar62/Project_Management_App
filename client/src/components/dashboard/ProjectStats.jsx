// src/components/dashboard/ProjectStats.jsx
import React from "react";

const ProjectStats = () => {
  return (
    <aside className="bg-gray-300 p-4 m-3 rounded-lg flex flex-col items-center space-y-4 drop-shadow-lg">
      <h1 className="text-xl font-bold">Project Completed</h1>
      <div className="rounded-full bg-slate-400 w-36 h-36 flex justify-center items-center">
        <h1 className="text-2xl font-bold">57%</h1>
      </div>
      <div className="text-center">
        <h3 className="font-semibold">2 Completed</h3>
        <p className="text-sm">9 Tasks Done</p>
      </div>
      <h2 className="text-blue-700 text-lg font-medium ">Current Tasks: </h2>
      <div className="">
        <h3 className="font-medium">Task 1: Review design</h3>
        <h3 className="font-medium">Task 2: Code review</h3>
      </div>
    </aside>
  );
};

export default ProjectStats;

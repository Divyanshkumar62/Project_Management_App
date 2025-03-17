// src/pages/Dashboard.jsx
import React from "react";
import Sidebar from "../components/dashboard/Sidebar";
import MainContent from "../components/dashboard/MainContent";
import ProjectStats from "../components/dashboard/ProjectStats";

const Dashboard = () => {
  return (
    <div className="flex justify-between h-screen">
      <Sidebar />
      <MainContent />
      <ProjectStats />
    </div>
  );
};

export default Dashboard;

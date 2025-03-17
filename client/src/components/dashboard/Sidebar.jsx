import React from "react";
import { IoGridOutline } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import { FaDiagramProject } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-20 h-screen flex flex-col justify-between items-center py-4">
      <div className="text-blue-700 font-bold text-xl">PF</div>
      <div className="text-gray-700 flex flex-col items-center justify-center gap-6">
        <span className="text-blue-700 cursor-pointer">
          <IoGridOutline size={30} />
        </span>
        <span className="cursor-pointer" onClick={() => navigate("/tasks")}>
          <FaDiagramProject size={30} />
        </span>
        <span className="cursor-pointer">
          <TbLogout2 size={30} />
        </span>
      </div>
      <div>
        <img
          className="w-16 h-16 rounded-full object-cover"
          src="/profile.jpg"
          alt="Profile"
        />
      </div>
    </div>
  );
};

export default Sidebar;

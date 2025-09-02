import React, { useContext } from "react";
import { IoGridOutline } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import { FaDiagramProject } from "react-icons/fa6";
import { BsListTask } from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logoutUser } = useContext(AuthContext);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-20 h-screen flex flex-col justify-between items-center py-4 bg-white shadow-sm">
      <div className="text-blue-700 font-bold text-xl">PMW</div>
      <div className="text-gray-700 flex flex-col items-center justify-center gap-6">
        <span 
          className={`cursor-pointer transition-colors ${isActive('/dashboard') ? 'text-blue-700' : 'hover:text-blue-700'}`}
          onClick={() => navigate("/dashboard")}
        >
          <IoGridOutline size={30} />
        </span>
        <span 
          className={`cursor-pointer transition-colors ${isActive('/projects') ? 'text-blue-700' : 'hover:text-blue-700'}`}
          onClick={() => navigate("/projects")}
        >
          <FaDiagramProject size={30} />
        </span>
        <span 
          className={`cursor-pointer transition-colors ${isActive('/my-tasks') ? 'text-blue-700' : 'hover:text-blue-700'}`}
          onClick={() => navigate("/my-tasks")}
        >
          <BsListTask size={30} />
        </span>
        <span
          className="cursor-pointer hover:text-red-600 transition-colors"
          onClick={() => {
            logoutUser();
            navigate("/login");
          }}
        >
          <TbLogout2 size={30} />
        </span>
      </div>
      <div>
        <img
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 cursor-pointer"
          src="/profile.jpg"
          alt="Profile"
          onClick={() => navigate("/profile")}
        />
      </div>
    </div>
  );
};

export default Sidebar;

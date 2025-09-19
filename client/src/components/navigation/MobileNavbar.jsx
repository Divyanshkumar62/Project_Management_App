import React, { useState, useContext } from "react";
import { IoGridOutline } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import { FaDiagramProject } from "react-icons/fa6";
import { FaClipboardList, FaBars, FaTimes } from "react-icons/fa";
import { BsListTask } from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const MobileNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, logoutUser } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateAndClose = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
    setIsMenuOpen(false);
  };

  return (
    <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-3">
          <img
            className="w-8 h-8"
            src="/main-logo.png"
            alt="Project Pilot Logo"
          />
          <div className="text-lg font-semibold">
            <span className="text-blue-600">Project</span>
            <span className="text-gray-500">Pilot</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <img
            className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 cursor-pointer"
            src={auth.user?.avatarUrl || "/profile.jpg"}
            alt="Profile"
            onClick={() => navigateAndClose("/profile")}
          />
          <button
            onClick={toggleMenu}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-gray-200 bg-white shadow-lg">
          <div className="p-4 space-y-3">
            <button
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                isActive('/dashboard') 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => navigateAndClose("/dashboard")}
            >
              <IoGridOutline size={20} />
              <span>Dashboard</span>
            </button>

            <button
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                isActive('/projects') 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => navigateAndClose("/projects")}
            >
              <FaDiagramProject size={20} />
              <span>Projects</span>
            </button>

            <button
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                isActive('/templates') 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => navigateAndClose("/templates")}
            >
              <FaClipboardList size={20} />
              <span>Templates</span>
            </button>

            <button
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                isActive('/my-tasks') 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => navigateAndClose("/my-tasks")}
            >
              <BsListTask size={20} />
              <span>My Tasks</span>
            </button>

            <hr className="my-3" />

            <button
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-red-50 text-red-600 transition-colors"
              onClick={handleLogout}
            >
              <TbLogout2 size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNavbar;
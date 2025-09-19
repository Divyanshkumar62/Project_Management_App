import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-lg relative">
      <div className="text-2xl sm:text-3xl font-semibold">
        <span className="text-blue-600">Project</span>
        <span className="text-gray-500">Flow</span>
      </div>
      
      {/* Desktop Menu */}
      <div className="hidden sm:flex justify-between items-center gap-4 lg:gap-8 text-white font-medium">
        <button
          onClick={() => navigate("/login")}
          className="py-2 px-4 bg-blue-600 rounded-lg cursor-pointer hover:border-2 hover:border-blue-600 hover:bg-white hover:text-blue-600 transition-all"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="py-2 px-4 border-2 border-blue-600 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-600 hover:text-white transition-all"
        >
          Sign Up
        </button>
      </div>

      {/* Mobile Menu Button */}
      <div className="sm:hidden">
        <button
          onClick={toggleMenu}
          className="text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-colors"
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 sm:hidden z-50">
          <div className="flex flex-col p-4 space-y-3">
            <button
              onClick={() => {
                navigate("/login");
                setIsMenuOpen(false);
              }}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors font-medium"
            >
              Login
            </button>
            <button
              onClick={() => {
                navigate("/signup");
                setIsMenuOpen(false);
              }}
              className="w-full py-3 px-4 border-2 border-blue-600 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-600 hover:text-white transition-colors font-medium"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;

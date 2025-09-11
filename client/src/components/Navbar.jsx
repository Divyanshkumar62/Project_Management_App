import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-lg">
      <div className="text-3xl font-semibold">
        <span className="text-blue-600">Project</span>
        <span className="text-gray-500">Flow</span>
      </div>
      <div className="flex justify-between items-center gap-8 text-white font-medium">
        <button
          onClick={() => navigate("/login")}
          className="py-2 px-4 bg-blue-600 rounded-lg cursor-pointer hover:border-2 hover:border-blue-600 hover:bg-white hover:text-blue-600"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="py-2 px-4 border-2 border-blue-600 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-600 hover:text-white"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Navbar;

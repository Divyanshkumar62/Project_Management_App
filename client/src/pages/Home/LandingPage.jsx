import React from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import TypewriterEffect from "../../components/ui/TypewriterEffect";

const LandingPage = () => {
  const navigate = useNavigate();

  const words = [
    {
      text: "Manage",
      className: "text-black",
    },
    {
      text: "Your",
      className: "text-black",
    },
    {
      text: "Projects",
      className: "text-black",
    },
    {
      text: "and",
      className: "text-black",
    },
    {
      text: "Tasks",
      className: "text-black",
    },
    {
      text: "Effortlessly!",
      className: "text-blue-600",
    },
  ];

  const handleButtonClick = () => {
    navigate('/login')
  }

  return (
    <div>
      <Navbar />
      <div className="text-center bg-white p-12 mt-12 text-black">
        <div className="text-4xl font-bold">
          <TypewriterEffect words={words} />
          {/* <span className="text-black">Manage Your Projects and Tasks</span>
          <span className="text-orange-500"> Effortlessly!</span> */}
        </div>
        <p className="text-lg text-gray-600 py-6 font-medium">
          Take full control of your projects today - start adding tasks, sorting
          <br /> your priorities and tracking your progress with ease. Stay
          organized and
          <br /> boost your productivity effortlessly!
        </p>
        <button
          onClick = {handleButtonClick}
          className="bg-blue-600 py-4 px-2 cursor-pointer hover:border-2 hover:border-blue-600 hover:bg-white hover:text-blue-600 text-white rounded-lg font-medium">
          Let's get started!
        </button>
      </div>
    </div>
  );
};

export default LandingPage;

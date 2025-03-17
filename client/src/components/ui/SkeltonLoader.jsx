import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-40 bg-gray-300 rounded"></div>
        <div className="h-6 w-60 bg-gray-300 rounded"></div>
        <div className="h-6 w-48 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;

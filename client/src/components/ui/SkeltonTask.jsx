import React from 'react';

const SkeletonTask = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="w-16 h-5 bg-gray-300 rounded-full"></div>
          </div>
          <div className="h-3 bg-gray-300 rounded w-full mb-1"></div>
          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
        </div>
        <div className="flex items-center gap-2 ml-3">
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm mb-3">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded w-20"></div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded w-16"></div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-3 bg-gray-300 rounded w-12"></div>
          <div className="w-20 h-6 bg-gray-300 rounded-full"></div>
        </div>
        <div className="h-3 bg-gray-300 rounded w-16"></div>
      </div>
    </div>
  );
};

export default SkeletonTask;

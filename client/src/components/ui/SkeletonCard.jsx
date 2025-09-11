import React from 'react';

const SkeletonCard = ({ className = '', height = 'h-32' }) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 animate-pulse ${height} ${className}`}>
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 rounded w-full"></div>
        <div className="h-3 bg-gray-300 rounded w-2/3"></div>
        <div className="flex justify-between pt-2">
          <div className="h-3 bg-gray-300 rounded w-16"></div>
          <div className="h-6 bg-gray-300 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

const SkeletonProjectCard = () => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse h-48">
    <div className="space-y-3">
      <div className="h-5 bg-gray-300 rounded w-2/3"></div>
      <div className="h-3 bg-gray-300 rounded w-full"></div>
      <div className="h-3 bg-gray-300 rounded w-3/4"></div>
      <div className="flex gap-2 mt-4">
        <div className="h-6 bg-gray-300 rounded-full w-20"></div>
        <div className="h-6 bg-gray-400 rounded-full w-16"></div>
      </div>
      <div className="flex justify-between pt-2">
        <div className="h-4 bg-gray-300 rounded w-20"></div>
        <div className="h-4 bg-gray-300 rounded w-16"></div>
      </div>
    </div>
  </div>
);

const SkeletonTaskList = () => (
  <div className="space-y-4">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="w-16 h-5 bg-gray-300 rounded-full"></div>
            </div>
            <div className="h-3 bg-gray-300 rounded w-4/5 mb-1"></div>
          </div>
          <div className="flex items-center gap-2 ml-3">
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
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
    ))}
  </div>
);

const SkeletonStats = () => (
  <div className="bg-white p-6 rounded-xl shadow-lg animate-pulse">
    <div className="h-6 bg-gray-300 rounded w-24 mb-6"></div>
    <div className="relative mb-6">
      <div className="rounded-full bg-gray-300 w-36 h-36 mx-auto"></div>
    </div>
    <div className="text-center mb-6">
      <div className="h-5 bg-gray-300 rounded w-32 mx-auto mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-24 mx-auto"></div>
    </div>
    <div className="h-32 bg-gray-100 rounded-lg"></div>
  </div>
);

export { SkeletonCard, SkeletonProjectCard, SkeletonTaskList, SkeletonStats };
export default SkeletonCard;

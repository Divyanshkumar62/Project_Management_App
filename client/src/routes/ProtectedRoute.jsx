import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { ProjectContext } from "../context/ProjectContext";

// Simulated authentication check
const isAuthenticated = () => {
  return localStorage.getItem("token") ? true : false;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

// Role-based Protected Route Component
const RoleProtectedRoute = ({
  children,
  projectId,
  requiredRole = "Owner",
}) => {
  const { canPerformAction } = useContext(ProjectContext);

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (projectId && !canPerformAction(projectId, requiredRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-4">
              You don't have permission to perform this action.
              {requiredRole === "Owner" &&
                " Only project owners can access this page."}
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export { ProtectedRoute, RoleProtectedRoute };

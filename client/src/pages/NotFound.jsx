import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="text-center p-10">
      <h1 className="text-3xl font-bold text-red-500">404 - Page Not Found</h1>
      <p>Oops! The page you are looking for doesn't exist.</p>
      <Link to="/" className="text-blue-500">
        Go to Landing Page
      </Link>
    </div>
  );
};

export default NotFound;

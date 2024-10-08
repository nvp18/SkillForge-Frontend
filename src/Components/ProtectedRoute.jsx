import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // If no token is found, redirect to the login page
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, allow access to the protected route
  return children;
};

export default ProtectedRoute;

import React from 'react';
import { Navigate } from 'react-router-dom';

const DefaultRoute = () => {
  const token = localStorage.getItem('authToken');

  // If the user is logged in, redirect to the dashboard; otherwise, redirect to login
  return token ? <Navigate to="/employee-dashboard" replace /> : <Navigate to="/login" replace />;
};

export default DefaultRoute;

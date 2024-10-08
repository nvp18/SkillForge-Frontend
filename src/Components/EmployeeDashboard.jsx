import React from "react";
import { useNavigate } from "react-router-dom";

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token
    localStorage.removeItem('role');  // Optionally remove the role
    navigate('/'); // Redirect to login page
  };

  return (
    <div>
      <h1>Welcome to Employee Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default EmployeeDashboard;

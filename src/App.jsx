import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminDashboard from "./Components/AdminDashboard";
import EmployeeDashboard from "./Components/EmployeeDashboard";
import Login from './Components/Login';
import ProtectedRoute from "./Components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-dashboard" element={<ProtectedRoute> <AdminDashboard /> </ProtectedRoute>}/>
        <Route path="/employee-dashboard" element={<ProtectedRoute> <EmployeeDashboard/> </ProtectedRoute>}/>
      </Routes>
    </Router>
  )
};

export default App;

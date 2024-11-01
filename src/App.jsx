import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CourseDashboard from "./Components/Dashboard";
import Login from './Components/Login';
import ProtectedRoute from "./Components/ProtectedRoute";
import ViewProfile from './Components/ViewProfile';
import Sidebar from "./Components/Sidebar";
import DefaultRoute from "./Components/DefaultRoute";

const App = () => {
  const isLoggedIn = localStorage.getItem('token') !== null;

  return (
    <Router>
      <div className="flex">
        {isLoggedIn && <Sidebar />}

        <div className={`flex-1 ${isLoggedIn ? 'ml-16 md:ml-64' : ''} p-6 transition-margin duration-300`}>
          <Routes>
            <Route path="/" element={<DefaultRoute />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <CourseDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ViewProfile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

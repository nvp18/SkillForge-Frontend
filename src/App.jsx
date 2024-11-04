import React from "react";
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import CreateCourse from "./Components/Admin/CreateCourse";
import CreateUser from "./Components/Admin/CreateUser";
import Dashboard from "./Components/Admin/Dashboard";
import ViewProfile from './Components/Admin/ViewProfile';
import Login from './Components/Auth/Login';
import { CourseProvider } from "./Components/Course/CourseContext"; // Import CourseProvider if using context
import CoursePage from './Components/Course/CoursePage';
import DeleteCourse from "./Components/Course/DeleteCourse";
import EditCourse from "./Components/Course/EditCourse";
import DeleteModule from "./Components/Course/Modules/DeleteModule";
import GetModules from "./Components/Course/Modules/GetModules";
import ModuleContent from "./Components/Course/Modules/ModuleContent";
import UpdateModule from "./Components/Course/Modules/UpdateModule";
import UploadModule from "./Components/Course/Modules/UploadModules";
import DefaultRoute from "./Components/Shared/DefaultRoute";
import ProtectedRoute from "./Components/Shared/ProtectedRoute";
import Sidebar from "./Components/Shared/Sidebar";

const AppContent = () => {
  const isLoggedIn = localStorage.getItem('token') !== null;
  const location = useLocation();

  // Show Sidebar only for logged-in users on specific routes
  const showSidebar = isLoggedIn && location.pathname !== "/login" && location.pathname !== "/";

  return (
    <div className="flex">
      {/* Conditionally render Sidebar only on specific logged-in routes */}
      {showSidebar && <Sidebar />}

      {/* Main content area adjusted based on the presence of sidebars */}
      <div className={`flex-1 ${showSidebar ? 'ml-16 md:ml-64' : ''} p-6 transition-margin duration-300`}>
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<DefaultRoute />} />

          {/* Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Dashboard Route */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Profile Route */}
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute>
                <ViewProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/create-user"
            element={
              <ProtectedRoute>
                <CreateUser />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/create-course"
            element={
              <ProtectedRoute>
                <CreateCourse />
              </ProtectedRoute>
            }
          />

          {/* Grouped Course Page Routes under CourseProvider */}
          <Route
            path="/course/:courseId/*"
            element={
              <ProtectedRoute>
                <CourseProvider>
                  <Routes>
                    <Route index element={<CoursePage />} />
                    <Route path="home" element = {<CoursePage/>}/>
                    <Route path="delete" element={<DeleteCourse />} />
                    <Route path="edit" element={<EditCourse />} />
                    <Route path="getModules" element={<GetModules />} />
                    <Route path="uploadModule" element={<UploadModule/>}/>
                    <Route path="deleteModule/:moduleId" element={<DeleteModule/>}/>
                    <Route path="updateModule/:moduleId" element={<UpdateModule/>}/>
                    <Route path="moduleContent/:moduleId" element={<ModuleContent/>}/>
                  </Routes>
                </CourseProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;

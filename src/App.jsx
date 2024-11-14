import React from "react";
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import AllUsers from "./Components/Admin/AllUsers";
import CreateCourse from "./Components/Admin/CreateCourse";
import CreateUser from "./Components/Admin/CreateUser";
import Dashboard from "./Components/Admin/Dashboard";
import GetAllConcerns from "./Components/Admin/GetAllConcerns";
import GetConcernById from "./Components/Admin/GetConcernById";
import ManageCourses from "./Components/Admin/ManageUserCourses";
import Login from './Components/Auth/Login';
import AddAnnouncement from "./Components/Course/Announcements/AddAnnouncements";
import EditAnnouncement from "./Components/Course/Announcements/EditAnnouncement";
import GetAnnouncement from "./Components/Course/Announcements/GetAnnouncement";
import Announcements from "./Components/Course/Announcements/GetAnnouncements";
import { CourseProvider } from "./Components/Course/CourseContext";
import CoursePage from './Components/Course/CoursePage';
import DeleteCourse from "./Components/Course/DeleteCourse";
import AddDiscussion from "./Components/Course/Discussions/AddDiscussion";
import GetDiscussion from "./Components/Course/Discussions/GetDiscussion";
import GetDiscussions from "./Components/Course/Discussions/GetDiscussions";
import EditCourse from "./Components/Course/EditCourse";
import DeleteModule from "./Components/Course/Modules/DeleteModule";
import GetModules from "./Components/Course/Modules/GetModules";
import ModuleContent from "./Components/Course/Modules/ModuleContent";
import UpdateModule from "./Components/Course/Modules/UpdateModule";
import UploadModule from "./Components/Course/Modules/UploadModules";
import Quiz from "./Components/Course/Quizes/Quiz";
import DefaultRoute from "./Components/Shared/DefaultRoute";
import Footer from "./Components/Shared/Footer";
import PageContainer from "./Components/Shared/PageContainer";
import ProtectedRoute from "./Components/Shared/ProtectedRoute";
import Sidebar from "./Components/Shared/Sidebar";
import ViewProfile from './Components/Shared/ViewProfile';

// Employee Routes

const AppContent = () => {
  const isLoggedIn = localStorage.getItem('token') !== null;
  const role = localStorage.getItem('role'); // Retrieve role from localStorage
  const location = useLocation();

  const showSidebar = isLoggedIn && location.pathname !== "/login" && location.pathname !== "/";
  const showFooter = location.pathname !== "/login";

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        {showSidebar && <Sidebar />}
        <div className={`flex-1 ${showSidebar ? 'ml-16 md:ml-64' : ''} p-6 transition-margin duration-300 flex flex-col`}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<DefaultRoute />} />
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><PageContainer><Dashboard /></PageContainer></ProtectedRoute>} />
            
            <Route path="/admin/create-user" element={<ProtectedRoute><PageContainer><CreateUser /></PageContainer></ProtectedRoute>} />
            <Route path="/admin/create-course" element={<ProtectedRoute><PageContainer><CreateCourse /></PageContainer></ProtectedRoute>} />
            <Route path="/admin/allUsers" element={<ProtectedRoute><AllUsers /></ProtectedRoute>} />
            <Route path="/users/:userId/manageCourses" element={<ProtectedRoute><ManageCourses /></ProtectedRoute>} />
            <Route path="/admin/concerns/:concernId" element={<ProtectedRoute><GetConcernById /></ProtectedRoute>} />

            {/* Common Routed */}
            <Route path="/profile" element={<ProtectedRoute><PageContainer><ViewProfile /></PageContainer></ProtectedRoute>} />
            <Route path="/concerns" element={<ProtectedRoute><GetAllConcerns /></ProtectedRoute>} />
            <Route path="/employee/concerns/:concernId" element={<ProtectedRoute><GetConcernById /></ProtectedRoute>} />

            {/* Course Routes */}
            <Route path="/course/:courseId/*" element={
              <ProtectedRoute>
                <CourseProvider>
                  <PageContainer>
                    <Routes>
                      <Route index element={<CoursePage />} />
                      <Route path="home" element={<CoursePage />} />
                      <Route path="delete" element={<DeleteCourse />} />
                      <Route path="edit" element={<EditCourse />} />
                      <Route path="getModules" element={<GetModules />} />
                      <Route path="uploadModule" element={<UploadModule />} />
                      <Route path="deleteModule/:moduleId" element={<DeleteModule />} />
                      <Route path="updateModule/:moduleId" element={<UpdateModule />} />
                      <Route path="moduleContent/:moduleId" element={<ModuleContent />} />
                      <Route path="announcements" element={<Announcements />} />
                      <Route path="addAnnouncement" element={<AddAnnouncement />} />
                      <Route path="announcement/:announcementId" element={<GetAnnouncement />} />
                      <Route path="announcement/:announcementId/editAnnouncement/:announcementId" element={<EditAnnouncement />} />
                      <Route path="create-quiz" element={<Quiz />} />
                      <Route path="discussions" element={<GetDiscussions />} />
                      <Route path="addDiscussion" element={<AddDiscussion />} />
                      <Route path="discussion/:discussionId" element={<GetDiscussion />} />
                    </Routes>
                  </PageContainer>
                </CourseProvider>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
      {showFooter && <Footer />}
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

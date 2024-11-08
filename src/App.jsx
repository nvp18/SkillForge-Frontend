import React from "react";
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import AllUsers from "./Components/Admin/AllUsers";
import CreateCourse from "./Components/Admin/CreateCourse";
import CreateUser from "./Components/Admin/CreateUser";
import Dashboard from "./Components/Admin/Dashboard";
import ManageCourses from "./Components/Admin/ManageUserCourses";
import ViewProfile from './Components/Admin/ViewProfile';
import Login from './Components/Auth/Login';
import AddAnnouncement from "./Components/Course/Announcements/AddAnnouncements";
import EditAnnouncement from "./Components/Course/Announcements/EditAnnouncement";
import GetAnnouncement from "./Components/Course/Announcements/GetAnnouncement";
import Announcements from "./Components/Course/Announcements/GetAnnouncements";
import { CourseProvider } from "./Components/Course/CourseContext"; // Import CourseProvider if using context
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

const AppContent = () => {
  const isLoggedIn = localStorage.getItem('token') !== null;
  const location = useLocation();

  // Show Sidebar only for logged-in users on specific routes
  const showSidebar = isLoggedIn && location.pathname !== "/login" && location.pathname !== "/";
  const showFooter = location.pathname !== "/login";

  return (
    <div className="flex flex-col min-h-screen">  {/* Flex column and min-h-screen */}
      <div className="flex flex-1">
        {/* Conditionally render Sidebar only on specific logged-in routes */}
        {showSidebar && <Sidebar />}

        {/* Main content area adjusted based on the presence of sidebars */}
        <div className={`flex-1 ${showSidebar ? 'ml-16 md:ml-64' : ''} p-6 transition-margin duration-300 flex flex-col`}>
          <Routes>
            {/* All Routes go here */}
                  <Route path="/" element={<DefaultRoute />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin/dashboard" element={<ProtectedRoute><PageContainer><Dashboard /></PageContainer></ProtectedRoute>} />
                  <Route path="/admin/profile" element={<ProtectedRoute><PageContainer><ViewProfile /></PageContainer></ProtectedRoute>} />
                  <Route path="/admin/create-user" element={<ProtectedRoute><PageContainer><CreateUser /></PageContainer></ProtectedRoute>} />
                  <Route path="/admin/create-course" element={<ProtectedRoute><PageContainer><CreateCourse /></PageContainer></ProtectedRoute>} />
                  <Route path = "/admin/allUsers" element={<ProtectedRoute><AllUsers/> </ProtectedRoute>}/>
                  <Route path="/users/:userId/manageCourses" element={<ProtectedRoute><ManageCourses/></ProtectedRoute>}/>
                  <Route path="/course/:courseId/*" element={<ProtectedRoute><CourseProvider><PageContainer>
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
                    <Route path="announcement/:announcementId" element={<GetAnnouncement/>} />
                    <Route path="announcement/:announcementId/editAnnouncement/:announcementId" element={<EditAnnouncement/>} />
                    <Route path="create-quiz" element={<Quiz/>} />
                    <Route path="discussions" element={<GetDiscussions/>}/>
                    <Route path="addDiscussion" element={<AddDiscussion />} />
                    <Route path="discussion/:discussionId" element={<GetDiscussion />} />
                


                  </Routes>
                  </PageContainer></CourseProvider></ProtectedRoute>} />
                  </Routes>
                </div>
                </div>

                {/* Footer remains at the bottom */}
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

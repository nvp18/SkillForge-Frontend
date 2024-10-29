import React from "react";
import { FaUserEdit, FaComments, FaBell, FaFolderOpen } from "react-icons/fa";

const CourseDashboard = ({ isAdmin }) => {
  // Dummy course data
  const courses = [
    {
      id: 1,
      title: "Resume Basics",
      code: "Resumes",
      term: "Catalog",
      color: "bg-gray-700",
      notifications: 1,
      messages: 0,
      files: 3,
    },
    {
      id: 2,
      title: "Fundamentals of AI and Deep Learning",
      code: "ENPM703",
      term: "Fall 2024",
      color: "bg-pink-500",
      notifications: 1,
      messages: 2,
      files: 5,
    },
    {
      id: 3,
      title: "Software Engineering",
      code: "ENPM613",
      term: "Fall 2024",
      color: "bg-blue-500",
      notifications: 2,
      messages: 1,
      files: 4,
    },
    {
      id: 4,
      title: "Machine Learning",
      code: "ENPM673",
      term: "Fall 2024",
      color: "bg-green-500",
      notifications: 0,
      messages: 3,
      files: 2,
    },
  ];

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Your current courses for the term</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div key={course.id} className={`rounded-lg shadow-lg overflow-hidden ${course.color} text-white`}>
            <div className="p-4">
              <h3 className="text-lg font-bold truncate">{course.title}</h3>
              <p className="text-sm">{course.code}</p>
              <p className="text-xs text-gray-200">{course.term}</p>
            </div>

            <div className="p-4 flex justify-between items-center bg-white text-gray-800">
              <div className="flex space-x-3">
                <span className="flex items-center space-x-1">
                  <FaBell />
                  {course.notifications > 0 && (
                    <span className="text-red-500 text-sm font-semibold">{course.notifications}</span>
                  )}
                </span>
                <span className="flex items-center space-x-1">
                  <FaComments />
                  {course.messages > 0 && (
                    <span className="text-red-500 text-sm font-semibold">{course.messages}</span>
                  )}
                </span>
                <span className="flex items-center space-x-1">
                  <FaFolderOpen />
                  {course.files > 0 && (
                    <span className="text-gray-600 text-sm font-semibold">{course.files}</span>
                  )}
                </span>
              </div>

              {/* Admin option */}
              {isAdmin && (
                <button className="p-1 rounded-full hover:bg-gray-200">
                  <FaUserEdit className="text-gray-600" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseDashboard;

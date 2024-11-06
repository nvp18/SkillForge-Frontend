import React, { useState } from "react";
import { FaBook, FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";

const CourseSidebar = ({ courseId }) => {
  const [isOpen, setIsOpen] = useState(false); // State to toggle sidebar visibility

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative md:flex">
      {/* Toggle button for mobile view */}
      <button
        className="md:hidden p-4 text-[#342056]"
        onClick={toggleSidebar}
      >
        <FaBars size={24} />
      </button>

      {/* Sidebar - positioned relatively within its container */}
      <div
        className={`absolute md:relative top-0 left-0 z-10 h-full w-60 bg-white text-[#342056] shadow-lg p-4 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:flex md:flex-col md:min-h-[90vh]`}
      >
        {/* Sidebar Header with Icon and Course Title */}
        <div className="flex items-center space-x-3 mb-6 px-2 py-4 bg-[#f5f5f5] rounded-lg hover:bg-slate-300">
          <FaBook size={24} className="text-[#a0595d]" />
          <h2 className="text-xl font-bold text-[#261640] truncate">
            {"Course Menu"}
          </h2>
        </div>

        {/* Divider */}
        <hr className="border-gray-300 mb-6" />

        {/* Menu Items */}
        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                to={`/course/${courseId}/home`}
                className="hover:bg-gray-200 p-2 rounded transition duration-300 block"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to={`/course/${courseId}/getModules`}
                className="hover:bg-gray-200 p-2 rounded transition duration-300 block"
              >
                Modules
              </Link>
            </li>
            <li>
              <Link
                to={`/course/${courseId}/discussions`}
                className="hover:bg-gray-200 p-2 rounded transition duration-300 block"
              >
                Discussions
              </Link>
            </li>
            <li>
              <Link
                to={`/course/${courseId}/announcements`}
                className="hover:bg-gray-200 p-2 rounded transition duration-300 block"
              >
                Announcements
              </Link>
            </li>
            <li>
              <Link
                to={`/course/${courseId}/edit`}
                className="hover:bg-gray-200 p-2 rounded transition duration-300 block"
              >
                Edit Course
              </Link>
            </li>
            <li>
              <Link
                to={`/course/${courseId}/delete`}
                className="hover:bg-gray-200 p-2 rounded transition duration-300 block"
              >
                Delete Course
              </Link>
            </li>
            <li>
              <Link
                to={`/course/${courseId}/create-quiz`}
                className="hover:bg-gray-200 p-2 rounded transition duration-300 block"
              >
                Create Quiz
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay for mobile sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-0 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default CourseSidebar;

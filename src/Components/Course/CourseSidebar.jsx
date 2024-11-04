import React from "react";
import { Link } from "react-router-dom";

const CourseSidebar = ({ courseId }) => {
  return (
    <div className="w-60 bg-white text-[#342056] h-screen p-4 fixed flex flex-col justify-between">
      <div>
        {/* Menu Items */}
        <nav className="mt-10">
          <ul className="space-y-4">
            <li>
              <Link
                to={`/course/${courseId}/home`}
                className="hover:bg-gray-400 p-2 rounded transition duration-300 block"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to={`/course/${courseId}/modules`}
                className="hover:bg-gray-400 p-2 rounded transition duration-300 block"
              >
                Modules
              </Link>
            </li>
            <li>
              <Link
                to={`/course/${courseId}/discussions`}
                className="hover:bg-gray-400 p-2 rounded transition duration-300 block"
              >
                Discussions
              </Link>
            </li>
            <li>
              <Link
                to={`/course/${courseId}/announcements`}
                className="hover:bg-gray-400 p-2 rounded transition duration-300 block"
              >
                Announcements
              </Link>
            </li>
            <li>
              <Link
                to={`/course/${courseId}/edit`}
                className="hover:bg-gray-400 p-2 rounded transition duration-300 block"
              >
                Edit Course
              </Link>
            </li>
            <li>
              <Link
                to={`/course/${courseId}/delete`}
                className="hover:bg-gray-400 p-2 rounded transition duration-300 block"
              >
                Delete Course
              </Link>
            </li>
            <li>
              <Link
                to={`/course/${courseId}/create-quiz`}
                className="hover:bg-gray-400 p-2 rounded transition duration-300 block"
              >
                Create Quiz
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default CourseSidebar;

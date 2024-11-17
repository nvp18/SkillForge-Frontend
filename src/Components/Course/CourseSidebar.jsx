// import React, { useEffect, useState } from "react";
// import { FaBook } from "react-icons/fa";
// import { Link, useParams } from "react-router-dom";

// const CourseSidebar = ({ courseId }) => {
//   const { courseId: paramCourseId } = useParams();
//   const resolvedCourseId = courseId || paramCourseId;
//   const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//   const toggleCourseSidebar = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   const handleResize = () => {
//     setIsMobile(window.innerWidth < 768);
//     setIsCollapsed(window.innerWidth < 768);
//   };

//   useEffect(() => {
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <div
//       className={`${
//         isCollapsed ? "w-16" : "w-[15vw] max-w-[250px]"
//       } bg-white text-[#342056] min-h-[88vh] p-4 transition-width duration-300 fixed left-[15vw] shadow-lg flex flex-col justify-between`}
//     >
//       <div>
//         {/* Toggle Button */}
//         <div className="flex justify-end">
//           <button
//             onClick={toggleCourseSidebar}
//             className="text-gray-500 focus:outline-none"
//           >
//           </button>
//         </div>

//         {/* Menu Header */}
//         <div className="flex items-center space-x-3 mb-6 px-2 py-4 bg-[#f5f5f5] rounded-lg hover:bg-slate-300">
//           <FaBook size={24} className="text-[#a0595d]" />
//           {!isCollapsed && (
//             <h2 className="text-xl font-bold text-[#261640]">Course Menu</h2>
//           )}
//         </div>

//         {/* Menu Items */}
//         <nav>
//           <ul className="space-y-4">
//             <li>
//               <Link
//                 to={`/course/${resolvedCourseId}/home`}
//                 className="hover:bg-gray-200 p-2 rounded transition duration-300 block"
//               >
//                 {!isCollapsed ? "Home" : <span title="Home">🏠</span>}
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to={`/course/${resolvedCourseId}/getModules`}
//                 className="hover:bg-gray-200 p-2 rounded transition duration-300 block"
//               >
//                 {!isCollapsed ? "Modules" : <span title="Modules">📘</span>}
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to={`/course/${resolvedCourseId}/discussions`}
//                 className="hover:bg-gray-200 p-2 rounded transition duration-300 block"
//               >
//                 {!isCollapsed ? "Discussions" : <span title="Discussions">💬</span>}
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to={`/course/${resolvedCourseId}/announcements`}
//                 className="hover:bg-gray-200 p-2 rounded transition duration-300 block"
//               >
//                 {!isCollapsed ? "Announcements" : <span title="Announcements">📢</span>}
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to={`/course/${resolvedCourseId}/edit`}
//                 className="hover:bg-gray-200 p-2 rounded transition duration-300 block"
//               >
//                 {!isCollapsed ? "Edit Course" : <span title="Edit Course">✏️</span>}
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to={`/course/${resolvedCourseId}/delete`}
//                 className="hover:bg-gray-200 p-2 rounded transition duration-300 block"
//               >
//                 {!isCollapsed ? "Delete Course" : <span title="Delete Course">🗑️</span>}
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to={`/course/${resolvedCourseId}/create-quiz`}
//                 className="hover:bg-gray-200 p-2 rounded transition duration-300 block"
//               >
//                 {!isCollapsed ? "Create Quiz" : <span title="Create Quiz">📝</span>}
//               </Link>
//             </li>
//           </ul>
//         </nav>
//       </div>
//     </div>
//   );
// };

// export default CourseSidebar;
import React, { useEffect, useState } from "react";
import { FaBook } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";

const CourseSidebar = ({ courseId }) => {
  const { courseId: paramCourseId } = useParams();
  const resolvedCourseId = courseId || paramCourseId;
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const role = localStorage.getItem("role"); // Retrieve the role from localStorage

  const toggleCourseSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
    setIsCollapsed(window.innerWidth < 768);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-[15vw] max-w-[250px]"
      } bg-white text-[#342056] min-h-[88vh] p-4 transition-width duration-300 fixed left-[15vw] shadow-lg flex flex-col justify-between`}
    >
      <div>
        {/* Toggle Button */}
        <div className="flex justify-end">
          <button
            onClick={toggleCourseSidebar}
            className="text-gray-500 focus:outline-none"
          ></button>
        </div>

        {/* Menu Header */}
        <div className="flex items-center space-x-3 mb-6 px-2 py-4 bg-[#f5f5f5] rounded-lg hover:bg-slate-300">
          <FaBook size={24} className="text-[#a0595d]" />
          {!isCollapsed && (
            <h2 className="text-xl font-bold text-[#261640]">Course Menu</h2>
          )}
        </div>

        {/* Menu Items */}
        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                to={`/course/${resolvedCourseId}/home`}
                className="hover:bg-gray-200 p-2 rounded transition duration-300 block"
              >
                {!isCollapsed ? "Home" : <span title="Home">🏠</span>}
              </Link>
            </li>
            <li>
              <Link
                to={`/course/${resolvedCourseId}/getModules`}
                className="hover:bg-gray-200 p-2 rounded transition duration-300 block"
              >
                {!isCollapsed ? "Modules" : <span title="Modules">📘</span>}
              </Link>
            </li>
            <li>
              <Link
                to={`/course/${resolvedCourseId}/discussions`}
                className="hover:bg-gray-200 p-2 rounded transition duration-300 block"
              >
                {!isCollapsed ? "Discussions" : <span title="Discussions">💬</span>}
              </Link>
            </li>
            <li>
              <Link
                to={`/course/${resolvedCourseId}/announcements`}
                className="hover:bg-gray-200 p-2 rounded transition duration-300 block"
              >
                {!isCollapsed ? "Announcements" : <span title="Announcements">📢</span>}
              </Link>
            </li>
            <li>
                  <Link
                    to={`/course/${resolvedCourseId}/create-quiz`}
                    className="hover:bg-gray-200 p-2 rounded transition duration-300 block"
                  >
                    {!isCollapsed ? "Quizzes" : <span title="Create Quiz">📝</span>}
                  </Link>
                </li>

            {/* Admin-only links */}
            {role === "ADMIN" && (
              <>
                <li>
                  <Link
                    to={`/course/${resolvedCourseId}/edit`}
                    className="hover:bg-gray-200 p-2 rounded transition duration-300 block"
                  >
                    {!isCollapsed ? "Edit Course" : <span title="Edit Course">✏️</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/course/${resolvedCourseId}/delete`}
                    className="hover:bg-gray-200 p-2 rounded transition duration-300 block"
                  >
                    {!isCollapsed ? "Delete Course" : <span title="Delete Course">🗑️</span>}
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default CourseSidebar;

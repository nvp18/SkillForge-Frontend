// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useCourse } from "../CourseContext";
// import CourseSidebar from "../CourseSidebar";
// import ModuleContent from "./ModuleContent";

// const GetModules = () => {
//   const { courseId } = useParams();
//   const { courseDetails } = useCourse();
//   const [modules, setModules] = useState([]);
//   const [selectedModuleIndex, setSelectedModuleIndex] = useState(null);
//   const [error, setError] = useState(null);
//   const [userRole, setUserRole] = useState(""); 
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserRole = async () => {
//       const token = localStorage.getItem("token");
//       try {
//         const response = await fetch("http://localhost:8080/api/user/viewProfile", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (response.ok) {
//           const data = await response.json();
//           setUserRole(data.role); 
//         } else {
//           throw new Error("Failed to fetch user role.");
//         }
//       } catch (err) {
//         console.error("Error fetching user role:", err);
//       }
//     };

//     fetchUserRole();
//   }, []);

//   useEffect(() => {
//     const fetchModules = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch(`http://localhost:8080/api/course/getCourseModules/${courseId}`, {
//           method: "GET",
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           const sortedModules = data.sort((a, b) => a.moduleNumber - b.moduleNumber);
//           setModules(sortedModules);
//         } else {
//           throw new Error("Failed to fetch modules.");
//         }
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     fetchModules();
//   }, [courseId]);

//   const handleModuleClick = (index) => {
//     setSelectedModuleIndex(index);
//   };

//   const closeModuleContent = () => {
//     setSelectedModuleIndex(null);
//   };

//   return (
//     <div className="flex">
//       <CourseSidebar courseId={courseId} />

//       <div className="flex-1 ml-64 md:ml-60 lg:ml-72 p-4 bg-gray-50 min-h-[88vh]">
//         {error && <p className="text-red-500">{error}</p>}

//         <div className="flex flex-col md:flex-row justify-between mb-8">
//           <div className="mb-4 md:mb-0">
//             <h1 className="text-2xl md:text-3xl font-bold text-[#342056]">{courseDetails?.courseName}</h1>
//             <p className="text-sm md:text-lg text-gray-700">{courseDetails?.courseDescription}</p>
//           </div>

//           {userRole === "ADMIN" && ( // Only show Upload Module for Admin
//             <button
//               onClick={() => navigate(`/course/${courseId}/uploadModule`)}
//               className="bg-[#368e8f] hover:bg-[#5aa5a8] text-white font-bold py-2 px-4 rounded text-sm md:text-base"
//             >
//               Upload Module
//             </button>
//           )}
//         </div>

//         {/* Modules List */}
//         <div className="space-y-4">
//           {modules.map((module, index) => (
//             <div
//               key={module.moduleId}
//               className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
//             >
//               <div className="flex flex-col md:flex-row justify-between items-center">
//                 <div
//                   onClick={() => handleModuleClick(index)}
//                   className="flex items-center space-x-2 cursor-pointer"
//                 >
//                   <h2 className="text-lg md:text-xl font-semibold text-[#342056]">{module.moduleName}</h2>
//                 </div>

//                 {userRole === "ADMIN" && ( // Show update and delete options only for Admin
//                   <div className="flex items-center space-x-4 mt-4 md:mt-0">
//                     <button
//                       className="bg-teal-700 hover:bg-teal-800 text-white font-bold py-1 px-3 md:px-4 rounded text-sm"
//                       onClick={() => navigate(`/course/${courseId}/updateModule/${module.moduleId}`)}
//                     >
//                       Update
//                     </button>
//                     <button
//                       className="bg-orange-700 hover:bg-orange-800 text-white font-bold py-1 px-3 md:px-4 rounded text-sm"
//                       onClick={() => navigate(`/course/${courseId}/deleteModule/${module.moduleId}`)}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 )}
//               </div>
//               <hr className="mt-4 border-t-2 border-[#b5a0e6]" />
//             </div>
//           ))}
//         </div>

//         {/* Module Content */}
//         {selectedModuleIndex !== null && (
//           <ModuleContent
//             moduleContents={modules}
//             initialIndex={selectedModuleIndex}
//             closeViewer={closeModuleContent}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default GetModules;


import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCourse } from "../CourseContext";
import CourseSidebar from "../CourseSidebar";
import ModuleContent from "./ModuleContent";

const GetModules = () => {
  const { courseId } = useParams();
  const { courseDetails } = useCourse();
  const [modules, setModules] = useState([]);
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(null);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [courseStarted, setCourseStarted] = useState(false); // Track course start
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:8080/api/user/viewProfile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.role);
        } else {
          throw new Error("Failed to fetch user role.");
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/api/course/getCourseModules/${courseId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          const sortedModules = data.sort((a, b) => a.moduleNumber - b.moduleNumber);
          setModules(sortedModules);
        } else {
          throw new Error("Failed to fetch modules.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchModules();
  }, [courseId]);

  const handleStartCourse = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/employee/startCourse/e5eae186-a663-4716-a534-5460b7734655", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setCourseStarted(true);
      } else {
        throw new Error("Failed to start course.");
      }
    } catch (error) {
      console.error("Error starting course:", error);
    }
  };

  const handleModuleCompletion = async (moduleId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/employee/updateModuleCompleted/${moduleId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setModules((prevModules) =>
          prevModules.map((module) =>
            module.moduleId === moduleId
              ? { ...module, completed: !module.completed }
              : module
          )
        );
      } else {
        throw new Error("Failed to update module completion.");
      }
    } catch (error) {
      console.error("Error updating module completion:", error);
    }
  };

  const handleModuleClick = (index) => {
    setSelectedModuleIndex(index);
  };

  const closeModuleContent = () => {
    setSelectedModuleIndex(null);
  };

  return (
    <div className="flex">
      <CourseSidebar courseId={courseId} />

      <div className="flex-1 ml-64 md:ml-60 lg:ml-72 p-4 bg-gray-50 min-h-[88vh]">
        {error && <p className="text-red-500">{error}</p>}

        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-[#342056]">{courseDetails?.courseName}</h1>
            <p className="text-sm md:text-lg text-gray-700">{courseDetails?.courseDescription}</p>
          </div>

          {userRole === "ADMIN" ? (
            <button
              onClick={() => navigate(`/course/${courseId}/uploadModule`)}
              className="bg-[#368e8f] hover:bg-[#5aa5a8] text-white font-bold py-2 px-4 rounded text-sm md:text-base"
            >
              Upload Module
            </button>
          ) : (
            <button
              onClick={handleStartCourse}
              className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${
                courseStarted ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={courseStarted}
            >
              {courseStarted ? "Started" : "Start Course"}
            </button>
          )}
        </div>

        {/* Modules List */}
        <div className="space-y-4">
          {modules.map((module, index) => (
            <div
              key={module.moduleId}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div
                  onClick={() => handleModuleClick(index)}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <h2 className="text-lg md:text-xl font-semibold text-[#342056]">{module.moduleName}</h2>
                </div>

                {userRole === "ADMIN" ? (
                  <div className="flex items-center space-x-4 mt-4 md:mt-0">
                    <button
                      className="bg-teal-700 hover:bg-teal-800 text-white font-bold py-1 px-3 md:px-4 rounded text-sm"
                      onClick={() => navigate(`/course/${courseId}/updateModule/${module.moduleId}`)}
                    >
                      Update
                    </button>
                    <button
                      className="bg-orange-700 hover:bg-orange-800 text-white font-bold py-1 px-3 md:px-4 rounded text-sm"
                      onClick={() => navigate(`/course/${courseId}/deleteModule/${module.moduleId}`)}
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleModuleCompletion(module.moduleId)}
                    className={`py-1 px-3 md:px-4 rounded text-sm font-bold ${
                      module.completed
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-gray-500 hover:bg-gray-600 text-white"
                    }`}
                  >
                    {module.completed ? "Completed" : "Mark as Completed"}
                  </button>
                )}
              </div>
              <hr className="mt-4 border-t-2 border-[#b5a0e6]" />
            </div>
          ))}
        </div>

        {/* Module Content */}
        {selectedModuleIndex !== null && (
          <ModuleContent
            moduleContents={modules}
            initialIndex={selectedModuleIndex}
            closeViewer={closeModuleContent}
          />
        )}
      </div>
    </div>
  );
};

export default GetModules;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../apiClient";
import { useCourse } from "../CourseContext";
import CourseSidebar from "../CourseSidebar";
import ModuleContent from "./ModuleContent";

const Modal = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-lg relative">
      <p className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">{message}</p>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
        >
          OK
        </button>
      </div>
    </div>
  </div>
);

const GetModules = () => {
  const { courseId } = useParams();
  const { courseDetails } = useCourse();
  const [modules, setModules] = useState([]);
  const [moduleStatuses, setModuleStatuses] = useState({});
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(null);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [courseStarted, setCourseStarted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Success modal state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await apiClient.get("/api/user/viewProfile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserRole(response.data.role);
      } catch (err) {
        console.error("Error fetching user role:", err.response?.data?.message || err.message);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchModulesAndStatuses = async () => {
      const token = localStorage.getItem("token");

      try {
        const modulesResponse = await apiClient.get(`/api/course/getCourseModules/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sortedModules = modulesResponse.data.sort((a, b) => a.moduleNumber - b.moduleNumber);
        setModules(sortedModules);

        if (userRole === "EMPLOYEE") {
          const statusResponse = await apiClient.get(`/api/employee/getModuleStatus/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const statusMap = statusResponse.data.reduce((acc, status) => {
            acc[status.moduleId] = status.isCompleted;
            return acc;
          }, {});
          setModuleStatuses(statusMap);

          const courseStatusResponse = await apiClient.get(`/api/employee/getCourseStatus/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setCourseStarted(courseStatusResponse.data.status === "STARTED");
        }
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred while fetching data.");
      }
    };

    fetchModulesAndStatuses();
  }, [courseId, userRole]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("uploadSuccess")) {
      setShowSuccessModal(true); // Show success modal if upload was successful
      params.delete("uploadSuccess");
      navigate(window.location.pathname);
    }
  }, [navigate]);

  const handleStartCourse = async () => {
    try {
      const token = localStorage.getItem("token");

      await apiClient.post(
        `/api/employee/startCourse/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCourseStarted(true);
    } catch (error) {
      console.error("Error starting course:", error.response?.data?.message || error.message);
    }
  };

  const handleModuleCompletion = async (moduleId) => {
    try {
      const token = localStorage.getItem("token");

      await apiClient.post(
        `/api/employee/updateModuleCompleted/${moduleId}/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setModuleStatuses((prevStatuses) => ({
        ...prevStatuses,
        [moduleId]: !prevStatuses[moduleId],
      }));
    } catch (error) {
      console.error(
        "Error updating module completion:",
        error.response?.data?.message || error.message
      );
    }
  };

  const handleModuleClick = (index) => {
    setSelectedModuleIndex(index);
  };

  const closeModuleContent = () => {
    setSelectedModuleIndex(null);
  };

  return (
    <div className="flex min-h-[88vh] bg-gray-50">
      <CourseSidebar courseId={courseId} />

      <div className={`flex-1 transition-all duration-300 ease-in-out ${
          window.innerWidth < 768 ? "ml-16" : "ml-[15vw]"
        } p-8 space-y-6`}>
        {error && <p className="text-red-500">{error}</p>}

        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-[#342056]">{courseDetails?.courseName}</h1>
            <p className="text-sm md:text-lg text-gray-700">{courseDetails?.courseDescription}</p>
          </div>

          {userRole !== "ADMIN" && (
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

          {userRole === "ADMIN" && (
            <button
              onClick={() => navigate(`/course/${courseId}/uploadModule?uploadSuccess=true`)}
              className="bg-[#368e8f] hover:bg-[#5aa5a8] text-white font-bold py-2 px-4 rounded text-sm md:text-base"
            >
              Upload Module
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
                      moduleStatuses[module.moduleId]
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-gray-500 hover:bg-gray-600 text-white"
                    }`}
                  >
                    {moduleStatuses[module.moduleId] ? "Completed" : "Mark as Completed"}
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

        {/* Success Modal */}
        {showSuccessModal && (
          <Modal
            message="Module uploaded successfully!"
            onClose={() => setShowSuccessModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default GetModules;

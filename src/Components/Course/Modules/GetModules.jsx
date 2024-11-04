// GetModules.jsx
import React, { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa"; // Import PDF icon
import { useNavigate, useParams } from "react-router-dom";
import { useCourse } from "../CourseContext";
import CourseSidebar from "../CourseSidebar";

const GetModules = () => {
  const { courseId } = useParams();
  const { courseDetails } = useCourse();
  const [modules, setModules] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/api/course/getCourseModules/${courseId}`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
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

  return (
    <div className="flex">
      <CourseSidebar courseId={courseId} />
      
      <div className="flex-1 ml-64 md:ml-60 p-8 bg-gray-50 min-h-screen">
        {error && <p className="text-red-500">{error}</p>}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#342056]">{courseDetails?.courseName}</h1>
            <p className="text-lg text-gray-700">{courseDetails?.courseDescription}</p>
          </div>
          <button
            onClick={() => navigate(`/course/${courseId}/uploadModule`)}
            className="bg-[#74bec1] hover:bg-[#5aa5a8] text-white font-bold py-2 px-4 rounded"
          >
            Upload Module
          </button>
        </div>

        {/* Modules List */}
        <div>
          {modules.map((module) => (
            <div key={module.moduleId} className="bg-white p-4 mb-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-semibold text-[#342056]">{module.moduleName}</h2>
                  {/* PDF icon next to module name */}
                  <FaFilePdf
                    className="text-red-500 cursor-pointer"
                    title="Open PDF"
                    onClick={() => navigate(`/course/${courseId}/moduleContent/${module.moduleId}`)}
                  />
                </div>
                <div className="space-x-2">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                    onClick={() => navigate(`/course/${courseId}/updateModule/${module.moduleId}`)}
                  >Update</button>
                  <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
                    onClick={() => navigate(`/course/${courseId}/deleteModule/${module.moduleId}`)}
                  >Delete</button>
                </div>
              </div>
              <hr className="mt-4" style={{ borderColor: "#b5a0e6" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GetModules;

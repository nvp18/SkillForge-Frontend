import React, { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useCourse } from "../CourseContext";
import CourseSidebar from "../CourseSidebar";
import ModuleContent from './ModuleContent';

const GetModules = () => {
  const { courseId } = useParams();
  const { courseDetails } = useCourse();
  const [modules, setModules] = useState([]);
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(null); // Index for navigation
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

  // Function to handle clicking on the module name (opens ModuleContent)
  const handleModuleClick = (index) => {
    setSelectedModuleIndex(index);
  };

  // Function to handle PDF download when clicking the PDF icon
  const handleDownloadPdf = async (moduleId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/course/downloadModulePdf/${moduleId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Module_${moduleId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        console.error("Failed to download PDF.");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const closeModuleContent = () => {
    setSelectedModuleIndex(null);
  };

  return (
    <div className="flex">
      <CourseSidebar courseId={courseId} />
      
      <div className="flex-1 ml-64 md:ml-60 p-8 bg-gray-50 min-h-[88vh]">
        {error && <p className="text-red-500">{error}</p>}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#342056]">{courseDetails?.courseName}</h1>
            <p className="text-lg text-gray-700">{courseDetails?.courseDescription}</p>
          </div>
          <button
            onClick={() => navigate(`/course/${courseId}/uploadModule`)}
            className="bg-[#368e8f] hover:bg-[#5aa5a8] text-white font-bold py-2 px-4 rounded"
          >
            Upload Module
          </button>
        </div>

        {/* Modules List */}
        <div>
          {modules.map((module, index) => (
            <div key={module.moduleId} className="bg-white p-4 mb-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <div
                  onClick={() => handleModuleClick(index)} // Pass the index
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <h2 className="text-xl font-semibold text-[#342056]">{module.moduleName}</h2>
                </div>
                <FaFilePdf
                  className="text-red-500 cursor-pointer"
                  title="Download PDF"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering module click
                    handleDownloadPdf(module.moduleId);
                  }}
                />
                <div className="space-x-2">
                  <button className="bg-teal-700 hover:bg-teal-800 text-white font-bold py-1 px-4 rounded"
                    onClick={() => navigate(`/course/${courseId}/updateModule/${module.moduleId}`)}
                  >Update</button>
                  <button className="bg-orange-700 hover:bg-orange-800 text-white font-bold py-1 px-4 rounded"
                    onClick={() => navigate(`/course/${courseId}/deleteModule/${module.moduleId}`)}
                  >Delete</button>
                </div>
              </div>
              <hr className="mt-4" style={{ borderColor: "#b5a0e6" }} />
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

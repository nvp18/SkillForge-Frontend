import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

const ModuleContent = ({ moduleContents, initialIndex, closeViewer }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8080/api/course/getModuleContent/${moduleContents[currentIndex].moduleId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSelectedPdfUrl(data.message);
        } else {
          throw new Error("Failed to fetch PDF URL.");
        }
      } catch (error) {
        setError(error.message);
        setSelectedPdfUrl(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPdfUrl();
  }, [currentIndex, moduleContents]);

  const goToPrevModule = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const goToNextModule = () => {
    if (currentIndex < moduleContents.length - 1) {
      setCurrentIndex((nextIndex) => nextIndex + 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-5xl w-full h-[85vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{moduleContents[currentIndex]?.moduleName}</h2>
          <button
            onClick={closeViewer}
            className="text-red-600 hover:text-red-800 focus:outline-none"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden bg-gray-100 rounded-lg shadow-inner">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <p>Loading PDF...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            selectedPdfUrl && (
              <iframe
                src={selectedPdfUrl}
                title={moduleContents[currentIndex]?.moduleName}
                width="100%"
                height="100%"
                className="rounded-lg"
                style={{ border: "none" }}
              />
            )
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={goToPrevModule}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded shadow ${
              currentIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
          >
            <FaChevronLeft />
            Prev Module
          </button>

          <button
            onClick={goToNextModule}
            disabled={currentIndex === moduleContents.length - 1}
            className={`flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded shadow ${
              currentIndex === moduleContents.length - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
          >
            Next Module
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModuleContent;

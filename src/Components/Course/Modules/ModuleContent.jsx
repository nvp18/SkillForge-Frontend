import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
// import workerSrc from 'pdfjs-dist/build/pdf.worker.min.js';

// pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;


const ModuleContent = ({ moduleContents, initialIndex, closeViewer }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8080/api/course/getModuleContent/${moduleContents[currentIndex].moduleId}`,
          {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          setSelectedPdfUrl(blobUrl); // Set the PDF Blob URL for rendering
        } else {
          throw new Error('Failed to fetch PDF.');
        }
      } catch (error) {
        setError(error.message);
        setSelectedPdfUrl(null); // Reset URL on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchPdf();
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
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full h-[80vh] overflow-y-auto">
        <button
          onClick={closeViewer}
          className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Close
        </button>
        <h2 className="text-xl font-bold mb-4">{moduleContents[currentIndex]?.moduleName}</h2>

        {isLoading ? (
          <p>Loading PDF...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          selectedPdfUrl && (
            <Document file={selectedPdfUrl}>
              <Page pageNumber={1} />
            </Document>
          )
        )}

        <div className="flex justify-between mt-4">
          <button
            onClick={goToPrevModule}
            disabled={currentIndex === 0}
            className={`px-4 py-2 bg-blue-500 text-white rounded ${
              currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
          >
            Prev Module
          </button>
          <button
            onClick={goToNextModule}
            disabled={currentIndex === moduleContents.length - 1}
            className={`px-4 py-2 bg-blue-500 text-white rounded ${
              currentIndex === moduleContents.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
          >
            Next Module
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModuleContent;

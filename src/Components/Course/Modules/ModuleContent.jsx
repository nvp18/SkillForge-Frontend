import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ModuleContent = ({ moduleContents, initialIndex, closeViewer }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfBlob, setBlob] = useState(null)

  useEffect(() => {
    const fetchPdfUrl = async () => {
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
          console.log(response)
          //const pdfUrl = "https://skillforgecoursemodules.s3.amazonaws.com/Object%20Oriented%20Programming%20With%20Python/Intro%20to%20OOPS%20in%20python/Understanding_Object_Oriented_Programming_in_Python.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20241107T010712Z&X-Amz-SignedHeaders=host&X-Amz-Expires=36000&X-Amz-Credential=AKIAQKPIMGDML6LRG6OZ%2F20241107%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=68188a684102c095d51cfbc5014bc7d8e07a76a1bc8c6a46ebb5bb019d70f3ab"
          const pdfUrl = await response.json(); // Assuming the response body contains the URL as a string
          console.log("setting url")
          setSelectedPdfUrl(pdfUrl.message);
          //const blob = await fetch(pdfUrl)
          //console.log(blob);
          //const blobData = await blob.blob();
          //setBlob(blobData)
        } else {
          throw new Error('Failed to fetch PDF URL.');
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
            <iframe
              src={selectedPdfUrl}
              title={moduleContents[currentIndex]?.moduleName}
              width="100%"
              height="80%"
              style={{ border: 'none' }}
          />
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

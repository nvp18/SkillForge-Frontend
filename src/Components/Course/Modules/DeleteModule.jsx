// DeleteModule.jsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DeleteModule = () => {
  const { moduleId, courseId } = useParams();
  const navigate = useNavigate();
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const handleDeleteModule = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/course/deleteCourseModule/${moduleId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSuccessModalOpen(true);
      } else {
        setError("Failed to delete the module.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleSuccessClose = () => {
    setSuccessModalOpen(false);
    navigate(`/course/${courseId}/getModules`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="bg-white rounded-lg p-8 shadow-lg w-96 text-center">
        <h2 className="text-xl font-semibold mb-4 text-[#342056]">Delete Module</h2>
        <p className="text-gray-700 mb-6">Are you sure you want to delete this module?</p>
        
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleDeleteModule}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => navigate(`/course/${courseId}/getModules`)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {successModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-center text-[#342056]">Module successfully deleted</h2>
            <div className="flex justify-center">
              <button
                onClick={handleSuccessClose}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteModule;

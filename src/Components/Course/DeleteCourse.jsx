import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CourseSidebar from "./CourseSidebar";
import apiClient from "../../apiClient";

const DeleteCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(true); // Track if confirmation is shown

  const handleDeleteCourse = async () => {
    setConfirmDelete(false); // Hide confirmation section
    try {
      const token = localStorage.getItem("token");
      await apiClient.delete(`/api/course/deleteCourse/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccessModalOpen(true); // Show success modal on success
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete the course. Please try again.");
    }
  };
  

  const handleSuccessClose = () => {
    setSuccessModalOpen(false);
    navigate("/dashboard");
  };

  const handleCancel = () => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="flex">
      <CourseSidebar />

      <div className="flex-1 flex flex-col items-center justify-center min-h-[88vh] bg-gray-50 p-4">
        {/* Only show confirmation if confirmDelete is true */}
        {confirmDelete && (
          <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md text-center">
            <h2 className="text-xl font-semibold mb-4 text-[#342056]">Delete Course</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this course?</p>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDeleteCourse}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Yes, Delete
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {successModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm text-center">
              <h2 className="text-lg font-semibold mb-4 text-[#342056]">Course successfully deleted</h2>
              <button
                onClick={handleSuccessClose}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteCourse;

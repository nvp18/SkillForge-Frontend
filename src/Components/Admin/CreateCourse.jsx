import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../apiClient";


const CreateCourse = () => {
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseTags, setCourseTags] = useState("");
  const [daysToFinish, setDaysToFinish] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const courseData = {
      courseName,
      courseDescription,
      courseTags,
      daysToFinish: parseInt(daysToFinish, 10),
    };
  
    const token = localStorage.getItem("token");
  
    try {
      // Axios automatically handles the Content-Type for JSON
      const response = await apiClient.post("/api/course/createCourse", courseData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Axios resolves 2xx status codes, so we check if data is present
      if (response.data) {
        setModalMessage("Course successfully created");
        setSuccessModalOpen(true);
        resetForm();
      }
    } catch (err) {
      // Handle different error cases
      if (err.response?.status === 500) {
        setModalMessage("Course creation failed. Please check your input.");
      } else {
        setModalMessage("An error occurred. Please try again.");
      }
      setErrorModalOpen(true);
    }
  };
  

  const resetForm = () => {
    setCourseName("");
    setCourseDescription("");
    setCourseTags("");
    setDaysToFinish("");
  };

  const closeModals = () => {
    setSuccessModalOpen(false);
    setErrorModalOpen(false);
    if (successModalOpen) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-[88vh] flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
          Create New Course
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base" htmlFor="courseName">
              Course Name
            </label>
            <input
              type="text"
              id="courseName"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md text-gray-700 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base" htmlFor="courseDescription">
              Course Description
            </label>
            <textarea
              id="courseDescription"
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md text-gray-700 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base" htmlFor="courseTags">
              Course Tags (comma-separated)
            </label>
            <input
              type="text"
              id="courseTags"
              value={courseTags}
              onChange={(e) => setCourseTags(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md text-gray-700 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base" htmlFor="daysToFinish">
              Days to Finish
            </label>
            <input
              type="number"
              id="daysToFinish"
              value={daysToFinish}
              onChange={(e) => setDaysToFinish(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md text-gray-700 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Course
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {successModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm">
            <h2 className="text-lg md:text-xl font-semibold text-center mb-4">{modalMessage}</h2>
            <button
              onClick={closeModals}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md w-full"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm">
            <h2 className="text-lg md:text-xl font-semibold text-center mb-4">{modalMessage}</h2>
            <button
              onClick={closeModals}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md w-full"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCourse;

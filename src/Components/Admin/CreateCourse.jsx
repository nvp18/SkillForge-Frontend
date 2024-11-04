import React, { useState } from "react";

const CreateCourse = () => {
    const [courseName, setCourseName] = useState("");
    const [courseDescription, setCourseDescription] = useState("");
    const [courseTags, setCourseTags] = useState("");
    const [daysToFinish, setDaysToFinish] = useState("");
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const handleSubmit = async (e) => {
    e.preventDefault();
    const courseData = {
        courseName,
        courseDescription,
        courseTags,
        daysToFinish: parseInt(daysToFinish, 10), // Convert to number
    };

    const token = localStorage.getItem('token');

    try {
        const response = await fetch('http://localhost:8080/api/course/createCourse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
      });

      if (response.ok) {
        // Show success modal on success
        setModalMessage("Course successfully created");
        setSuccessModalOpen(true);
        resetForm();
      } else if (response.status === 500) {
        setModalMessage("Course creation failed. Please check your input."); // Set error message
        setErrorModalOpen(true); // Show error modal
      } else {
        setModalMessage('An error occurred. Please try again.'); // Generic error message for other errors
        setErrorModalOpen(true); // Show error modal
      }
    } catch {
      setModalMessage('An error occurred while creating the course.'); // Handle request failure
      setErrorModalOpen(true); // Show error modal
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
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="courseName">
            Course Name
          </label>
          <input
            type="text"
            id="courseName"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="courseDescription">
            Course Description
          </label>
          <textarea
            id="courseDescription"
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="courseTags">
            Course Tags (comma-separated)
          </label>
          <input
            type="text"
            id="courseTags"
            value={courseTags}
            onChange={(e) => setCourseTags(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="daysToFinish">
            Days to Finish
          </label>
          <input
            type="number"
            id="daysToFinish"
            value={daysToFinish}
            onChange={(e) => setDaysToFinish(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Course
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {successModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-center">{modalMessage}</h2>
            <div className="flex justify-center">
              <button
                onClick={closeModals}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-center">{modalMessage}</h2>
            <div className="flex justify-center">
              <button
                onClick={closeModals}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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

export default CreateCourse;

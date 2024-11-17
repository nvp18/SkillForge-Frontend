import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CourseSidebar from "./CourseSidebar";
import apiClient from "../../apiClient";

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseDescription, setCourseDescription] = useState("");
  const [courseTags, setCourseTags] = useState("");
  const [daysToFinish, setDaysToFinish] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await apiClient.get(`/api/course/getCourseDetails/${courseId}`);
        const data = response.data;
  
        setCourseDescription(data.courseDescription);
        setCourseTags(data.courseTags);
        setDaysToFinish(data.daysToFinish);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load course details.");
      }
    };
  
    fetchCourseDetails();
  }, [courseId]);

  const handleUpdateCourse = async (e) => {
  e.preventDefault();

  const updatedCourseData = {
    courseDescription,
    courseTags,
    daysToFinish: parseInt(daysToFinish, 10),
  };

  try {
    await apiClient.put(`/api/course/updateCourse/${courseId}`, updatedCourseData);
    setSuccessModalOpen(true);
  } catch (err) {
    setError(err.response?.data?.message || "Failed to update course details. Please try again.");
  }
};


  const handleCancel = () => {
    navigate(`/course/${courseId}`);
  };

  const handleSuccessClose = () => {
    setSuccessModalOpen(false);
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="flex">
      <CourseSidebar courseId={courseId} />

      <div className="flex-1 flex items-center justify-center min-h-[88vh] bg-gray-50 p-4">
        <form
          onSubmit={handleUpdateCourse}
          className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 w-full max-w-lg"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center text-[#342056]">Edit Course</h2>

          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="courseDescription">
              Course Description
            </label>
            <textarea
              id="courseDescription"
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Update Course
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Cancel
            </button>
          </div>
        </form>

        {successModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm text-center">
              <h2 className="text-lg font-semibold mb-4 text-[#342056]">Course details successfully updated</h2>
              <button
                onClick={handleSuccessClose}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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

export default EditCourse;

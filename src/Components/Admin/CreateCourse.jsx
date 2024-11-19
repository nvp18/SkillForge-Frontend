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
      const response = await apiClient.post("/api/course/createCourse", courseData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        setModalMessage("Course successfully created");
        setSuccessModalOpen(true);
        resetForm();
      }
    } catch (err) {
      setModalMessage(err.response?.data?.message || "An error occurred. Please try again.");
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
        <form onSubmit={handleSubmit} data-testid="create-course-form">
          <div className="mb-4">
            <label htmlFor="courseName" data-testid="course-name-label">
              Course Name
            </label>
            <input
              type="text"
              id="courseName"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
              data-testid="course-name-input"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="courseDescription" data-testid="course-description-label">
              Course Description
            </label>
            <textarea
              id="courseDescription"
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              required
              data-testid="course-description-input"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="courseTags" data-testid="course-tags-label">
              Course Tags (comma-separated)
            </label>
            <input
              type="text"
              id="courseTags"
              value={courseTags}
              onChange={(e) => setCourseTags(e.target.value)}
              required
              data-testid="course-tags-input"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="daysToFinish" data-testid="days-to-finish-label">
              Days to Finish
            </label>
            <input
              type="number"
              id="daysToFinish"
              value={daysToFinish}
              onChange={(e) => setDaysToFinish(e.target.value)}
              required
              data-testid="days-to-finish-input"
            />
          </div>
          <button type="submit" data-testid="submit-button">Create Course</button>
        </form>
      </div>

      {successModalOpen && (
        <div data-testid="success-modal">
          <h2>{modalMessage}</h2>
          <button onClick={closeModals}>OK</button>
        </div>
      )}

      {errorModalOpen && (
        <div data-testid="error-modal">
          <h2>{modalMessage}</h2>
          <button onClick={closeModals}>OK</button>
        </div>
      )}
    </div>
  );
};

export default CreateCourse;

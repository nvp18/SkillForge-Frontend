import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../apiClient";

const ManageCourses = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [unassignedCourses, setUnassignedCourses] = useState([]);
  const [selectedAssignCourse, setSelectedAssignCourse] = useState("");
  const [selectedDeassignCourse, setSelectedDeassignCourse] = useState("");
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
  
      try {
        // Fetch assigned courses
        const assignedResponse = await apiClient.get(`/api/course/getAllCoursesOfEmployee/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const assigned = assignedResponse.data.map((entry) => ({
          course: entry.course,
          status: entry.status,
        }));
  
        setAssignedCourses(assigned);
  
        // Fetch all courses
        const allCoursesResponse = await apiClient.get("/api/course/getAllCourses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const allCourses = allCoursesResponse.data;
        const unassigned = allCourses.filter(
          (course) =>
            !assigned.some((assignedCourse) => assignedCourse.course.courseId === course.courseId)
        );
  
        setUnassignedCourses(unassigned);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch courses.");
      }
    };
  
    fetchCourses();
  }, [userId]);
  

  const handleAssignCourse = async () => {
    const token = localStorage.getItem("token");
  
    try {
      await apiClient.post(
        `/api/course/assignCourseToEmployee/${selectedAssignCourse}/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // If successful, show success message
      setModalMessage("Course successfully assigned.");
    } catch (err) {
      // Handle errors and show appropriate message
      setModalMessage(err.response?.data?.message || "An error occurred while assigning the course.");
    } finally {
      setShowModal(true);
    }
  };
  
  const handleDeassignCourse = async () => {
    const token = localStorage.getItem("token");
  
    try {
      await apiClient.delete(
        `/api/course/deassignCourseToEmployee/${selectedDeassignCourse}/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // If successful, show success message
      setModalMessage("Course successfully deassigned.");
    } catch (err) {
      // Handle errors and show appropriate message
      setModalMessage(err.response?.data?.message || "An error occurred while deassigning the course.");
    } finally {
      setShowModal(true);
    }
  };
  

  const handleCloseModal = () => {
    setShowModal(false);
    navigate(0); // Refresh the page
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-[90vh]">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#342056] mb-6 sm:mb-8 text-center sm:text-left">
        Manage Courses
      </h1>
      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Assigned Courses</h2>
        <ul>
          {assignedCourses.map((entry) => (
            <li key={entry.course.courseId} className="flex justify-between py-2 text-sm sm:text-base">
              <div>
                <strong>{entry.course.courseName}</strong> - {entry.status}
              </div>
              <p className="text-gray-500">{new Date(entry.course.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row mt-8 space-y-6 sm:space-y-0 sm:space-x-6">
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-2">Assign a Course</h3>
          <select
            value={selectedAssignCourse}
            onChange={(e) => setSelectedAssignCourse(e.target.value)}
            className="border p-2 rounded-lg w-full mb-4"
          >
            <option value="">Select a Course</option>
            {unassignedCourses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.courseName}
              </option>
            ))}
          </select>
          <button
            onClick={handleAssignCourse}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
          >
            Assign
          </button>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold mb-2">Deassign a Course</h3>
          <select
            value={selectedDeassignCourse}
            onChange={(e) => setSelectedDeassignCourse(e.target.value)}
            className="border p-2 rounded-lg w-full mb-4"
          >
            <option value="">Select a Course</option>
            {assignedCourses.map((entry) => (
              <option key={entry.course.courseId} value={entry.course.courseId}>
                {entry.course.courseName} - {entry.status}
              </option>
            ))}
          </select>
          <button
            onClick={handleDeassignCourse}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
          >
            Deassign
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-gray-800">{modalMessage}</p>
            <button
              onClick={handleCloseModal}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCourses;

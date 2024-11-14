import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
        const response = await fetch(`http://localhost:8080/api/course/getAllCoursesOfEmployee/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const assigned = await response.json();
          setAssignedCourses(assigned.map((entry) => ({
            course: entry.course,
            status: entry.status,
          })));

          const allCoursesResponse = await fetch("http://localhost:8080/api/course/getAllCourses", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (allCoursesResponse.ok) {
            const allCourses = await allCoursesResponse.json();
            const unassigned = allCourses.filter(
              (course) => !assigned.some((assignedCourse) => assignedCourse.course.courseId === course.courseId)
            );
            setUnassignedCourses(unassigned);
          }
        } else {
          throw new Error("Failed to fetch assigned courses.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCourses();
  }, [userId]);

  const handleAssignCourse = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:8080/api/course/assignCourseToEmployee/${selectedAssignCourse}/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setModalMessage("Course successfully assigned.");
      } else {
        throw new Error("Failed to assign course.");
      }
    } catch {
      setModalMessage("An error occurred while assigning the course.");
    } finally {
      setShowModal(true);
    }
  };

  const handleDeassignCourse = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:8080/api/course/deassignCourseToEmployee/${selectedDeassignCourse}/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setModalMessage("Course successfully deassigned.");
      } else {
        throw new Error("Failed to deassign course.");
      }
    } catch {
      setModalMessage("An error occurred while deassigning the course.");
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

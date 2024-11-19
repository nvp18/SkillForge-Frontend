import React, { useEffect, useState } from "react";
import { FaClock, FaFolderOpen, FaUserEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import b3 from "../../assets/b3.jpg";
import apiClient from "../../apiClient";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
  
      let apiUrl;
      if (role === "ADMIN") {
        apiUrl = "/api/course/getAllCourses";
      } else if (role === "EMPLOYEE") {
        apiUrl = "/api/employee/getAllEmployeeCourses";
      }
  
      try {
        const response = await apiClient.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourses(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred while fetching courses.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchCourses();
  }, []);
  
  if (loading) return <p className="text-center text-gray-600" data-testid="loading-message">Loading...</p>;
  if (error) return <p className="text-center text-red-500" data-testid="error-message">{error}</p>;

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const role = localStorage.getItem("role");

  return (
    <div className="flex">
      <div className="flex-grow p-8 bg-gray-100 min-h-[88vh]">
        <header className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-semibold text-gray-800" data-testid="dashboard-title">
            {role === "ADMIN" ? "Admin Dashboard" : "Employee Dashboard"}
          </h1>
          <p className="text-sm lg:text-base text-gray-600" data-testid="dashboard-subtitle">
            {role === "ADMIN" ? "Manage all courses and users" : "Your assigned courses"}
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {courses.map((course) => (
            <div
              key={course.courseId}
              className="rounded-lg shadow-lg overflow-hidden bg-cover bg-center cursor-pointer flex flex-col justify-between"
              style={{ backgroundImage: `url(${b3})` }}
              onClick={() => handleCourseClick(course.courseId || course.course?.courseId)}
              data-testid={`course-card-${course.courseId || course.course?.courseId}`}
            >
              <div className="p-6 md:p-8 lg:p-10 flex-1">
                <h3 className="text-lg lg:text-xl font-extrabold truncate text-yellow-300" data-testid="course-name">
                  {course.courseName || course.course?.courseName}
                </h3>
                <p className="text-sm lg:text-base font-bold text-yellow-200" data-testid="course-tags">
                  {course.courseTags || course.course?.courseTags}
                </p>
              </div>

              <div className="p-3 md:p-4 flex justify-between items-center bg-white text-gray-800">
                <div className="flex space-x-3">
                  <span className="flex items-center space-x-1">
                    <FaClock />
                    <span className="text-xs md:text-sm text-gray-600 font-semibold" data-testid="days-to-finish">
                      {course.daysToFinish} days
                    </span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <FaFolderOpen />
                    <span className="text-xs md:text-sm text-gray-600 font-semibold">Files</span>
                  </span>
                </div>

                {role === "ADMIN" && (
                  <button
                    className="p-1 rounded-full hover:bg-gray-200"
                    data-testid={`edit-button-${course.courseId || course.course?.courseId}`}
                  >
                    <FaUserEdit className="text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

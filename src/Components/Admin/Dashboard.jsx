import React, { useEffect, useState } from "react";
import { FaClock, FaFolderOpen, FaUserEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import b3 from "../../assets/b3.jpg";

const Dashboard = ({ isAdmin }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:8080/api/course/getAllCourses", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        } else {
          setError("Failed to fetch courses");
        }
      } catch (err) {
        setError("An error occurred while fetching courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Your current courses for the term</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div
            key={course.courseId}
            className="rounded-lg shadow-lg overflow-hidden bg-cover bg-center cursor-pointer"
            style={{ backgroundImage: `url(${b3})` }}
            onClick={() => handleCourseClick(course.courseId)}
          >
            <div className="p-10">
              <h3 className="text-lg font-extrabold truncate text-white">{course.courseName}</h3>
              <p className="text-base font-bold text-white">{course.courseTags}</p>
            </div>

            <div className="p-4 flex justify-between items-center bg-white text-gray-800">
              <div className="flex space-x-3">
                <span className="flex items-center space-x-1">
                  <FaClock />
                  <span className="text-gray-600 text-sm font-semibold">{course.daysToFinish} days</span>
                </span>
                <span className="flex items-center space-x-1">
                  <FaFolderOpen />
                  <span className="text-gray-600 text-sm font-semibold">Files</span>
                </span>
              </div>

              {isAdmin && (
                <button className="p-1 rounded-full hover:bg-gray-200">
                  <FaUserEdit className="text-gray-600" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

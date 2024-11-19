import React, { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../../apiClient"; // Adjust the path if necessary

// Create the context
const CourseContext = createContext();

// Custom hook to use the Course context
export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourse must be used within a CourseProvider");
  }
  return context;
};

// Context provider component
export const CourseProvider = ({ children }) => {
  const { courseId } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseId) {
        setError("Course ID is required.");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token is missing.");
        }

        const response = await apiClient.get(`/api/course/getCourseDetails/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourseDetails(response.data);
        setError(null); // Clear any previous errors
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || "An error occurred while fetching course details.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  return (
    <CourseContext.Provider value={{ courseDetails, setCourseDetails, loading, error }}>
      {children}
    </CourseContext.Provider>
  );
};

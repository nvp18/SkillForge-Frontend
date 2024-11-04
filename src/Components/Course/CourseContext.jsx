import React, { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CourseContext = createContext();

export const useCourse = () => useContext(CourseContext);

export const CourseProvider = ({ children }) => {
  const { courseId } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseDetails && courseId) { // Fetch only if details are missing and courseId is available
        const token = localStorage.getItem("token");
        try {
          const response = await fetch(`http://localhost:8080/api/course/getCourseDetails/${courseId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setCourseDetails(data);
          } else {
            throw new Error("Failed to fetch course details");
          }
        } catch (err) {
          console.error("Error fetching course details:", err.message);
        }
      }
    };

    fetchCourseDetails();
  }, [courseId, courseDetails]);

  return (
    <CourseContext.Provider value={{ courseDetails, setCourseDetails }}>
      {children}
    </CourseContext.Provider>
  );
};

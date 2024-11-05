import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCourse } from "./CourseContext";
import CourseSidebar from "./CourseSidebar";

const CoursePage = () => {
  const { courseId } = useParams();
  const { courseDetails, setCourseDetails } = useCourse(); // Use course context directly
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      try {
        const response = await fetch(`http://localhost:8080/api/course/getCourseDetails/${courseId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Include token in Authorization header
          },
        });
        if (!response.ok) throw new Error("Failed to fetch course details");
        const data = await response.json();
        setCourseDetails(data); // Update the context value directly
        
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCourseDetails();
  }, [courseId, setCourseDetails]);

  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!courseDetails) return <p>Loading...</p>;

  const { courseName, courseDescription, courseTags, createdAt, updatedAt, daysToFinish } = courseDetails;

  return (
    <div className="flex-1">
      <CourseSidebar courseId={courseId} />
      
      <div className="ml-64 p-8 space-y-6 bg-gray-50 min-h-[90vh]">
        <h2 className="text-3xl font-bold text-[#342056]">{courseName}</h2>
        <p className="text-lg text-gray-700">{courseDescription}</p>
        
        <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-[#74bec1]">Tags</h3>
            <p className="text-gray-600">{courseTags}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[#74bec1]">Days to Finish</h3>
            <p className="text-gray-600">{daysToFinish} days</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[#74bec1]">Created At</h3>
            <p className="text-gray-600">{new Date(createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[#74bec1]">Updated At</h3>
            <p className="text-gray-600">{new Date(updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;

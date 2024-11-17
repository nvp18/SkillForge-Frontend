import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCourse } from "./CourseContext";
import CourseSidebar from "./CourseSidebar";
import apiClient from "../../apiClient"; // Adjust the path as necessary

const CoursePage = () => {
  const { courseId } = useParams();
  const { courseDetails, setCourseDetails } = useCourse();
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await apiClient.get(`/api/course/getCourseDetails/${courseId}`);
        setCourseDetails(response.data); // Axios directly returns data in response.data
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch course details.");
      }
    };
  
    fetchCourseDetails();
  }, [courseId, setCourseDetails]);
  

  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!courseDetails) return <p>Loading...</p>;

  const { courseName, courseDescription, courseTags, createdAt, updatedAt, daysToFinish } = courseDetails;

  return (
    <div className="flex min-h-[88vh] bg-gray-50">
      <CourseSidebar courseId={courseId} />

      {/* Main content area */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          window.innerWidth < 768 ? "ml-16" : "ml-[15vw]"
        } p-8 space-y-6`}
      >
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

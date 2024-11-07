import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CourseSidebar from "./CourseSidebar";

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseDescription, setCourseDescription] = useState("");
  const [courseTags, setCourseTags] = useState("");
  const [daysToFinish, setDaysToFinish] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [error, setError] = useState(null);

  // Fetch the course details on mount
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/api/course/getCourseDetails/${courseId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCourseDescription(data.courseDescription);
          setCourseTags(data.courseTags);
          setDaysToFinish(data.daysToFinish);
        } else {
          setError("Failed to load course details.");
        }
      } catch (err) {
        setError("An error occurred. Please try again.");
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
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/course/updateCourse/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedCourseData),
      });

      if (response.ok) {
        setSuccessModalOpen(true);
      } else {
        setError("Failed to update course details.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleCancel = () =>{
    navigate(`/course/${courseId}`)
  }
  const handleSuccessClose = () => {
    setSuccessModalOpen(false);
    navigate(`/course/${courseId}`);
  };

  return (
    <> 
    <CourseSidebar courseId={courseId}/>

    <div className="flex items-center justify-center min-h-[88vh] bg-gray-50">
      <form onSubmit={handleUpdateCourse} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
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
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex items-center justify-evenly">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update Course
          </button>

          <button 
                type="submit"
                className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleCancel}>
                Cancel
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {successModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-center text-[#342056]">Course details successfully updated</h2>
            <div className="flex justify-center">
              <button
                onClick={handleSuccessClose}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default EditCourse;

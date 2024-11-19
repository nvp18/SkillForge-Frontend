import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../apiClient";
import CourseSidebar from "../CourseSidebar";

const GetDiscussions = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [discussions, setDiscussions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiscussions = async () => {
      const token = localStorage.getItem("token");
  
      try {
        const response = await apiClient.get(`/api/course/getAllDiscussions/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Sort discussions by date, newest first
        const sortedDiscussions = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setDiscussions(sortedDiscussions);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch discussions.");
      }
    };
  
    fetchDiscussions();
  }, [courseId]);
  

  const handleAddDiscussion = () => {
    navigate(`/course/${courseId}/addDiscussion`);
  };

  return (
    <div className="flex min-h-[88vh] bg-gray-50">
      <CourseSidebar />
      <div className={`flex-1 transition-all duration-300 ease-in-out ${
          window.innerWidth < 768 ? "ml-16" : "ml-[15vw]"
        } p-8 space-y-6`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#342056]">Discussions</h1>
          <button
            onClick={handleAddDiscussion}
            className="bg-[#368e8f] hover:bg-[#5aa5a8] text-white font-bold py-2 px-4 rounded text-sm md:text-base lg:py-3 lg:px-6"
          >
            Add Discussion
          </button>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {/* Discussions List */}
        <div>
          {discussions.map((discussion) => (
            <div
              key={discussion.id}
              className="bg-white p-3 sm:p-4 mb-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div className="flex items-center space-x-2">
                <h2
                  className="text-lg md:text-xl font-semibold text-gray-800 cursor-pointer"
                  onClick={() => navigate(`/course/${courseId}/discussion/${discussion.id}`)}
                >
                  {discussion.title}
                </h2>
              </div>
              <div className="text-left sm:text-right mt-2 sm:mt-0">
                <p className="text-gray-500">Posted on:</p>
                <p className="text-gray-800 font-semibold">
                  {new Date(discussion.createdat).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GetDiscussions;

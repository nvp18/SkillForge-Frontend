// GetDiscussions.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
        const response = await fetch(`http://localhost:8080/api/course/getAllDiscussions/${courseId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Sort discussions by date, newest first
          const sortedDiscussions = data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setDiscussions(sortedDiscussions);
        } else {
          throw new Error("Failed to fetch discussions.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchDiscussions();
  }, [courseId]);

  const handleAddDiscussion = () => {
    navigate(`/course/${courseId}/addDiscussion`);
  };

  return (
    <div className="flex">
      <CourseSidebar />
      <div className="flex-1 ml-10 md:ml-60 p-8 bg-gray-50 min-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#342056]">Discussions</h1>
          <button
            onClick={handleAddDiscussion}
            className="bg-[#368e8f] hover:bg-[#5aa5a8] text-white font-bold py-2 px-4 rounded"
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
              className="bg-white p-4 mb-4 rounded-lg shadow-md flex justify-between items-center"
            >
              <div className="flex items-center space-x-2">
                <h2
                  className="text-xl font-semibold text-gray-800 cursor-pointer"
                  onClick={() => navigate(`/course/${courseId}/discussion/${discussion.id}`)}
                >
                  {discussion.title}
                </h2>
              </div>
              <div className="text-right">
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

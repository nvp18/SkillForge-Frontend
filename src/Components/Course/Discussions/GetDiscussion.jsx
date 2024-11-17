import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CourseSidebar from "../CourseSidebar";
import apiClient from "../../../apiClient";

const GetDiscussion = () => {
  const { courseId, discussionId } = useParams();
  const navigate = useNavigate();
  const [discussion, setDiscussion] = useState(null);
  const [error, setError] = useState(null);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Fetch user role from local storage or API
    const fetchUserRole = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await apiClient.get("/api/user/viewProfile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Assuming 'role' is part of the profile response
        setUserRole(response.data.role);
      } catch (err) {
        console.error("Error fetching user role:", err.response?.data?.message || err.message);
      }
    };
  
    fetchUserRole();
  }, []);
  

  useEffect(() => {
    const fetchDiscussions = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await apiClient.get(`/api/course/getAllDiscussions/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Find and set the selected discussion
        const selectedDiscussion = response.data.find((d) => d.id === discussionId);
        setDiscussion(selectedDiscussion);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch discussions.");
      }
    };
  
    fetchDiscussions();
  }, [courseId, discussionId]);
  

  const handleReply = async () => {
    const token = localStorage.getItem("token");
    setIsSubmitting(true);
  
    try {
      await apiClient.post(
        `/api/course/replyToDiscussion/${discussionId}`,
        { reply: replyText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setModalMessage("Reply posted successfully.");
      setShowModal(true);
      setReplyText("");
      setShowReplyBox(false);
  
      // Update the discussion with the new reply
      setDiscussion((prev) => ({
        ...prev,
        discussionReplyList: [
          ...prev.discussionReplyList,
          { id: Date.now(), repliedBy: "You", reply: replyText, repliedat: new Date().toISOString() },
        ],
      }));
    } catch (err) {
      setModalMessage(err.response?.data?.message || "An error occurred while posting the reply.");
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleCancelReply = () => {
    setShowReplyBox(false);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
  
    try {
      const response = await apiClient.delete(`/api/course/deleteDiscussion/${discussionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Set success message from server response
      setModalMessage(response.data.message || "Discussion successfully deleted.");
      setShowModal(true);
  
      // Ensure redirection happens only after confirmation
      setTimeout(() => {
        navigate(`/course/${courseId}/discussions`);
      }, 2000); // Optional delay for better user experience
    } catch (err) {
      // Handle errors and set appropriate message
      setModalMessage(err.response?.data?.message || "An error occurred while deleting the discussion.");
      setShowModal(true);
    }
  };
  

  const handleCloseModal = () => {
    setShowModal(false);
    if (modalMessage === "Discussion successfully deleted.") {
      navigate(`/course/${courseId}/discussions`);
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!discussion) return <p>Loading...</p>;

  return (
    <div className="flex">
      <CourseSidebar />
      <div className="flex-1 ml-16 md:ml-64 p-4 md:p-8 bg-gray-50 min-h-[90vh]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#342056]">{discussion.title}</h1>
          {userRole === "ADMIN" && ( // Conditionally render delete button for admin
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-4 sm:mt-0"
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
        </div>
        <p className="text-lg text-gray-800 mb-6">{discussion.description}</p>

        <div className="text-sm text-gray-500">
          <p>
            <strong>Created at:</strong> {new Date(discussion.createdat).toLocaleDateString()}{" "}
            {new Date(discussion.createdat).toLocaleTimeString()}
          </p>
          <p>
            <strong>Posted by:</strong> {discussion.createdby}
          </p>
        </div>

        <div className="mt-6">
          <button
            onClick={() => setShowReplyBox(!showReplyBox)}
            className="bg-[#FF9800] hover:bg-[#F57C00] text-white font-bold py-2 px-4 rounded"
          >
            Reply
          </button>
        </div>

        {showReplyBox && (
          <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-lg">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              rows="3"
              placeholder="Write your reply..."
            />
            <div className="flex justify-end mt-2 space-x-4">
              <button
                onClick={handleReply}
                className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
              >
                Post Reply
              </button>
              <button
                onClick={handleCancelReply}
                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-[#342056] mb-4">Replies</h2>
          {discussion.discussionReplyList.length > 0 ? (
            discussion.discussionReplyList.map((reply) => (
              <div key={reply.id} className="bg-white p-4 mb-4 rounded-lg shadow-md flex justify-between items-start">
                <div>
                  <p className="text-gray-800">
                    <strong>Replied By:</strong> {reply.repliedBy}
                  </p>
                  <p className="text-gray-800 mt-2">
                    <strong>Reply:</strong> {reply.reply}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 font-semibold">
                    {new Date(reply.repliedat).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No replies yet.</p>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
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

export default GetDiscussion;

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
    const fetchUserRole = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await apiClient.get("/api/user/viewProfile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalMessage("Reply posted successfully.");
      setShowModal(true);
      setReplyText("");
      setShowReplyBox(false);
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

  const handleCancelReply = () => setShowReplyBox(false);

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await apiClient.delete(`/api/course/deleteDiscussion/${discussionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModalMessage(response.data.message || "Discussion successfully deleted.");
      setShowModal(true);
    } catch (err) {
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#342056]">{discussion.title}</h1>
        {userRole === "ADMIN" && (
          <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" onClick={handleDelete}>
            Delete
          </button>
        )}
        <p>{discussion.description}</p>
        <button
          onClick={() => setShowReplyBox(!showReplyBox)}
          className="bg-[#FF9800] hover:bg-[#F57C00] text-white font-bold py-2 px-4 rounded"
        >
          Reply
        </button>
        {showReplyBox && (
          <div>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
            />
            <button onClick={handleReply}>Post Reply</button>
            <button onClick={handleCancelReply}>Cancel</button>
          </div>
        )}
      </div>
      {showModal && (
        <div data-testid="modal">
          <p>{modalMessage}</p>
          <button onClick={handleCloseModal}>OK</button>
        </div>
      )}
    </div>
  );
};

export default GetDiscussion;

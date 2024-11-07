import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CourseSidebar from "../CourseSidebar";

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
          const selectedDiscussion = data.find((d) => d.id === discussionId);
          setDiscussion(selectedDiscussion);
        } else {
          throw new Error("Failed to fetch discussions.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchDiscussions();
  }, [courseId, discussionId]);

  const handleReply = async () => {
    const token = localStorage.getItem("token");
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:8080/api/course/replyToDiscussion/${discussionId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reply: replyText }),
      });

      if (response.ok) {
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
      } else {
        throw new Error("Failed to post reply.");
      }
    } catch (err) {
      setModalMessage("An error occurred while posting the reply.");
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
      const response = await fetch(`http://localhost:8080/api/course/deleteDiscussion/${discussionId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setModalMessage(data.message || "Discussion successfully deleted.");
        setShowModal(true);
      } else {
        throw new Error("Failed to delete discussion.");
      }
    } catch (err) {
      setModalMessage("An error occurred while deleting the discussion.");
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (modalMessage === "Discussion Delete Successfully") {
      navigate(`/course/${courseId}/discussions`);
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!discussion) return <p>Loading...</p>;

  return (
    <>
      <CourseSidebar />
      <div className="flex-1 ml-64 md:ml-60 p-8 bg-gray-50 min-h-[90vh]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#342056]">{discussion.title}</h1>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleDelete}
          >
            Delete
          </button>
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
    </>
  );
};

export default GetDiscussion;

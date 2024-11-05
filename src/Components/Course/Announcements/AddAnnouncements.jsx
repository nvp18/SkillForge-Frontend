import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CourseSidebar from "../CourseSidebar";

const AddAnnouncement = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handlePostAnnouncement = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:8080/api/admin/postAnnouncement/${courseId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        setShowModal(true); // Show success modal on success
      } else {
        throw new Error("Announcement failed to post.");
      }
    } catch (error) {
      setError("An error occurred while posting the announcement. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate(`/course/${courseId}/announcements`);
  };

  const handleCancel = () => {
    navigate(`/course/${courseId}/announcements`);
  };

  return (
    <>
      <CourseSidebar />
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Add Announcement</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Title</label>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              rows="2"
              placeholder="Enter announcement title"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              rows="4"
              placeholder="Enter announcement description"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={handlePostAnnouncement}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Post
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-4 text-green-600">Announcement successfully posted.</h2>
            <button
              onClick={handleCloseModal}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AddAnnouncement;

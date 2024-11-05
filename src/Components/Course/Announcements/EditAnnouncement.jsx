import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CourseSidebar from "../CourseSidebar";

const EditAnnouncement = () => {
  const { announcementId, courseId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncementDetails = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`http://localhost:8080/api/admin/getAnnouncement/${announcementId}`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setTitle(data.title);
          setDescription(data.description);
        } else {
          throw new Error("Failed to fetch announcement details.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAnnouncementDetails();
  }, [announcementId]);

  const handleEditAnnouncement = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:8080/api/admin/editAnnouncement/${announcementId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        setShowModal(true);
      } else {
        throw new Error("Failed to edit announcement.");
      }
    } catch (err) {
      setError("An error occurred while editing the announcement. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate(`/course/${courseId}/announcement/${announcementId}`);
  };

  const handleCancel = () => {
    navigate(`/course/${courseId}/announcement/${announcementId}`);
  };

  return (
    <>
    <CourseSidebar/>
   
    <div className="p-8 min-h-[90vh] flex flex-col items-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Edit Announcement</h1>
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
            onClick={handleEditAnnouncement}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Edit
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm">
            <p className="text-lg font-semibold text-gray-800 mb-4">Announcement successfully edited.</p>
            <button
              onClick={handleCloseModal}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default EditAnnouncement;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../apiClient";
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
        const response = await apiClient.get(`/api/admin/getAnnouncement/${announcementId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        setTitle(data.title);
        setDescription(data.description);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch announcement details.");
      }
    };
    fetchAnnouncementDetails();
  }, [announcementId]);

  const handleEditAnnouncement = async () => {
    const token = localStorage.getItem("token");
    try {
      await apiClient.put(
        `/api/admin/editAnnouncement/${announcementId}`,
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowModal(true);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while editing the announcement. Please try again.");
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
      <CourseSidebar />
      <div className="p-8 min-h-[90vh] flex flex-col items-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Edit Announcement</h1>
          {error && <p data-testid="error-message" className="text-red-500 mb-4">{error}</p>}

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Title</label>
            <input
              defaultValue={title}
              onChange={(e) => setTitle(e.target.value)}
              data-testid="title-input"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter announcement title"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Description</label>
            <textarea
              defaultValue={description}
              onChange={(e) => setDescription(e.target.value)}
              data-testid="description-input"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              rows="4"
              placeholder="Enter announcement description"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={handleEditAnnouncement}
              data-testid="edit-button"
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

        {showModal && (
          <div data-testid="success-modal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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

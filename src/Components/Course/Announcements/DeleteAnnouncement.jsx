// DeleteAnnouncement.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DeleteAnnouncement = () => {
  const { announcementId, courseId } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const deleteAnnouncement = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`http://localhost:8080/api/admin/deleteAnnouncement/${announcementId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setShowModal(true);  // Show success modal on successful delete
        } else {
          throw new Error("Failed to delete announcement.");
        }
      } catch (err) {
        setError("An error occurred while deleting the announcement.");
      }
    };

    deleteAnnouncement();
  }, [announcementId]);

  const handleCloseModal = () => {
    setShowModal(false);
    navigate(`/course/${courseId}/announcements`); // Go back to the announcements page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      {error && <p className="text-red-500">{error}</p>}

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
            <h2 className="text-xl font-semibold mb-4">Announcement successfully deleted</h2>
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
  );
};

export default DeleteAnnouncement;

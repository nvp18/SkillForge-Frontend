import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../apiClient";
import CourseSidebar from "../CourseSidebar";

const GetAnnouncement = () => {
  const { announcementId, courseId } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Explicit loading state
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [role, setRole] = useState(""); // Track user role

  useEffect(() => {
    const fetchAnnouncement = async () => {
      setLoading(true); // Start loading
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("role"); // Assuming role is stored in localStorage
      setRole(userRole);

      const apiUrl =
        userRole === "ADMIN"
          ? `/api/admin/getAnnouncement/${announcementId}`
          : `/api/employee/getAnnouncement/${announcementId}`;

      try {
        const response = await apiClient.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAnnouncement(response.data); // Set the announcement data
        setError(null); // Clear error
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch announcement.");
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchAnnouncement();
  }, [announcementId]);

  const handleEdit = () => {
    navigate(`editAnnouncement/${announcementId}`);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await apiClient.delete(
        `/api/admin/deleteAnnouncement/${announcementId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setModalMessage(response.data.message);
      setShowModal(true);
    } catch (err) {
      setModalMessage(err.response?.data?.message || "Failed to delete announcement.");
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (modalMessage) {
      navigate(`/course/${courseId}/announcements`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <CourseSidebar />
      <div className="min-h-[88vh] bg-gray-50 flex justify-center items-center p-8 md:ml-64">
        <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-3xl min-h-fit">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">Title: {announcement.title}</h1>
          <p className="text-lg text-gray-800 mb-6">
            <b>Description: </b>
            {announcement.description}
          </p>

          <div className="text-gray-500 text-sm mb-6">
            <p>
              <strong>Created at:</strong> {new Date(announcement.createdat).toLocaleString()}
            </p>
            <p>
              <strong>Updated at:</strong> {new Date(announcement.updatedat).toLocaleString()}
            </p>
            <p>
              <strong>Created by:</strong> {announcement.createdby}
            </p>
          </div>

          {role === "ADMIN" && (
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleEdit}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
            <h2 className="text-xl font-semibold mb-4">{modalMessage}</h2>
            <button
              onClick={handleCloseModal}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GetAnnouncement;

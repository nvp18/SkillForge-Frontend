// GetAnnouncement.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CourseSidebar from "../CourseSidebar";

const GetAnnouncement = () => {
  const { announcementId } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`http://localhost:8080/api/admin/getAnnouncement/${announcementId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAnnouncement(data);
        } else {
          throw new Error("Failed to fetch announcement.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAnnouncement();
  }, [announcementId]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!announcement) return <p>Loading...</p>;

  const handleEdit = () => {
    navigate(`editAnnouncement/${announcementId}`);
  };

  const handleDelete = () => {
    navigate(`deleteAnnouncement/${announcementId}`);
  };

  return (
    <>
      <CourseSidebar />
      <div className="min-h-[90vh] bg-gray-50 flex justify-center p-8">
        {error && <p className="text-red-500">{error}</p>}

        <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-3xl min-h-fit">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">Title: {announcement.title}</h1>
          <p className="text-lg text-gray-800 mb-6"><b>Description: </b>{announcement.description}</p>

          <div className="text-gray-500 text-sm mb-6">
            <p><strong>Created at:</strong> {new Date(announcement.createdat).toLocaleString()}</p>
            <p><strong>Updated at:</strong> {new Date(announcement.updatedat).toLocaleString()}</p>
            <p><strong>Created by:</strong> {announcement.createdby}</p>
          </div>

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
        </div>
      </div>
    </>
  );
};

export default GetAnnouncement;

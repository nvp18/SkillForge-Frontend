import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CourseSidebar from "../CourseSidebar";
import apiClient from "../../../apiClient";

const AddDiscussion = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handlePostDiscussion = async () => {
    const token = localStorage.getItem("token");
  
    try {
      await apiClient.post(
        `/api/course/postDiscussion/${courseId}`,
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Show success modal if the request is successful
      setModalMessage("Discussion successfully posted.");
      setShowModal(true);
    } catch (error) {
      // Handle errors and show appropriate message
      setError(error.response?.data?.message || "An error occurred while posting the discussion.");
      setModalMessage("Failed to post discussion.");
      setShowModal(true);
    }
  };
  

  const handleCloseModal = () => {
    setShowModal(false);
    navigate(`/course/${courseId}/discussions`);
  };

  const handleCancel = () => {
    navigate(`/course/${courseId}/discussions`);
  };

  return (
    <>
      <CourseSidebar />
      <div className="flex flex-1 flex-col items-center justify-center min-h-[88vh] bg-gray-50 p-4 sm:p-6 md:p-8">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Add Discussion</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Title</label>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              rows="2"
              placeholder="Enter discussion title"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              rows="4"
              placeholder="Enter discussion description"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={handlePostDiscussion}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
            <p className="text-lg font-semibold mb-4">{modalMessage}</p>
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

export default AddDiscussion;

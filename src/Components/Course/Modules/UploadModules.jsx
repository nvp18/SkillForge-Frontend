// UploadModule.jsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../apiClient";

const UploadModule = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [moduleName, setModuleName] = useState("");
  const [file, setFile] = useState(null);
  const [moduleNumber, setModuleNumber] = useState("");
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();
  
    formData.append("modulename", moduleName);
    formData.append("file", file);
    formData.append("modulenumber", moduleNumber);
  
    try {
      await apiClient.post(`/api/course/uploadCourseModule/${courseId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Handled automatically by Axios with FormData
        },
      });
  
      navigate(`/course/${courseId}/getModules`); // Redirect to GetModules page after successful upload
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload module. Please try again.");
    }
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold text-center text-[#342056] mb-4">Upload Module</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Module Name</label>
            <input
              type="text"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">File</label>
            <input
              type="file"
              onChange={handleFileChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Module Number</label>
            <input
              type="number"
              value={moduleNumber}
              onChange={(e) => setModuleNumber(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex justify-center">
            <button type="submit" className="bg-[#74bec1] hover:bg-[#5aa5a8] text-white font-bold py-2 px-4 rounded">
              Upload
            </button>
            <button
              type="button"
              onClick={() => navigate(`/course/${courseId}/getModules`)}
              className="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModule;

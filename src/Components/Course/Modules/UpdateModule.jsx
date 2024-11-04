// UpdateModule.jsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateModule = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const [moduleName, setModuleName] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Get JWT token from local storage
    const formData = new FormData();
    formData.append("file", file);
    formData.append("modulename", moduleName);
    
    try {
      const response = await fetch(`http://localhost:8080/api/course/updateCourseModule/${moduleId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`, // Include JWT in Authorization header
        },
        body: formData,
      });

      if (response.ok) {
        navigate(`/course/${courseId}/getModules`); // Redirect to GetModules on success
      } else {
        setError("Failed to update the module. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4 text-[#342056]">Update Module</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="moduleName">
              Module Name
            </label>
            <input
              type="text"
              id="moduleName"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
              File
            </label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="flex justify-center space-x-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => navigate(`/course/${courseId}/getModules`)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateModule;

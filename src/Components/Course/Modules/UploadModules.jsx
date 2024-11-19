import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../apiClient';

function UploadModules({ courseId }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      await apiClient.post(`/api/course/uploadCourseModule/${courseId}`, formData);
      navigate(`/course/modules/${courseId}`);
    } catch (error) {
      setError('Upload failed');
    }
  };

  return (
    <div className="modal">
      <h2>Upload Module</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="moduleName">Module Name</label>
          <input id="moduleName" name="moduleName" type="text" required />
        </div>
        <div>
          <label htmlFor="file">File</label>
          <input id="file" name="file" type="file" required />
        </div>
        <div>
          <label htmlFor="moduleNumber">Module Number</label>
          <input id="moduleNumber" name="moduleNumber" type="number" required />
        </div>
        <div>
          <button type="submit">Upload</button>
          <button type="button" onClick={() => navigate(`/course/modules/${courseId}`)}>Cancel</button>
        </div>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default UploadModules;

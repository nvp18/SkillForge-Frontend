import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    // Fetch profile data from API
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/user/viewProfile");
        const data = response.data;

        // Ignore password and set the profile state
        setProfile({
          userId: data.userId,
          userName: data.userName,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role,
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
  }, []);

  // Handle the form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setEditFormData({
      firstName: profile.firstName,
      lastName: profile.lastName,
    });
    setIsEditing(true);
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Here you can implement API call to update the data if needed
    setProfile({ ...profile, ...editFormData });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-10">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-8">
        <div className="flex items-center justify-between pb-6 border-b border-gray-300">
          <div>
            <h1 className="text-4xl font-semibold text-gray-800">Profile Information</h1>
            <p className="text-gray-600 mt-2">
              Welcome to your profile page. Below is your personal information.
            </p>
          </div>
          <div>
            <button
              onClick={toggleEdit}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-5 rounded-lg"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {profile ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Information Section */}
            <div className="bg-gray-100 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-800">Basic Information</h2>
              <div className="mt-6 space-y-4">
                <p>
                  <strong className="text-gray-700">User ID:</strong> {profile.userId}
                </p>
                <p>
                  <strong className="text-gray-700">User Name:</strong> {profile.userName}
                </p>
                <p>
                  <strong className="text-gray-700">First Name:</strong> {profile.firstName}
                </p>
                <p>
                  <strong className="text-gray-700">Last Name:</strong> {profile.lastName}
                </p>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="bg-gray-100 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-800">Contact Information</h2>
              <div className="mt-6 space-y-4">
                <p>
                  <strong className="text-gray-700">Email:</strong> {profile.email}
                </p>
                <p>
                  <strong className="text-gray-700">Role:</strong> {profile.role}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 mt-6">Loading profile data...</p>
        )}
      </div>

      {/* Edit Profile Popup Form */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Profile</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold">First Name:</label>
                <input
                  type="text"
                  name="firstName"
                  value={editFormData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Last Name:</label>
                <input
                  type="text"
                  name="lastName"
                  value={editFormData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProfile;

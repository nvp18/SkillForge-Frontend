import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import apiClient from "../../apiClient";

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-lg relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
      >
        ✕
      </button>
      {children}
    </div>
  </div>
);

const SuccessModal = ({ message, onClose }) => (
  <Modal onClose={onClose}>
    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">{message}</h2>
    <div className="flex justify-end">
      <button
        onClick={onClose}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
      >
        Close
      </button>
    </div>
  </Modal>
);

const ViewProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
  });
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [passwordError, setPasswordError] = useState(null);

  // Retrieve token once and store it in a variable
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get("/api/user/viewProfile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        setProfile({
          userId: data.userId,
          userName: data.userName,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role,
        });
      } catch (error) {
        console.error("Error fetching profile data:", error.response?.data?.message || error.message);
      }
    };

    fetchProfile();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData({ ...passwordFormData, [name]: value });
  };

  const toggleEdit = () => {
    setEditFormData({
      firstName: profile.firstName,
      lastName: profile.lastName,
    });
    setIsEditing(true);
  };

  const togglePasswordChange = () => {
    setPasswordFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsChangingPassword(true);
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await apiClient.put("/api/user/updateProfile", editFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile((prevProfile) => ({
        ...prevProfile,
        ...response.data,
      }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error.response?.data?.message || error.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError(null);

    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    try {
      await apiClient.put("/api/user/changePassword", passwordFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShowSuccessModal(true);
      setIsChangingPassword(false);
    } catch (error) {
      setPasswordError(error.response?.data?.message || "An error occurred while changing the password.");
    }
  };

  return (
    <div className="flex flex-col min-h-[90vh] bg-gray-100 px-4">
      <div className="flex-grow flex flex-col items-center py-10">
        <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-300">
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800">Profile Information</h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Welcome to your profile page. Below is your personal information.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={toggleEdit}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                Edit Profile
              </button>
              <button
                onClick={togglePasswordChange}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                Change Password
              </button>
            </div>
          </div>

          {profile ? (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-100 p-6 rounded-lg">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Basic Information</h2>
                <div className="mt-4 space-y-2 sm:space-y-4 text-sm sm:text-base">
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
              <div className="bg-gray-100 p-6 rounded-lg">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Contact Information</h2>
                <div className="mt-4 space-y-2 sm:space-y-4 text-sm sm:text-base">
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
      </div>

      {isEditing && (
        <Modal onClose={() => setIsEditing(false)}>
          <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold">First Name</label>
              <input
                type="text"
                name="firstName"
                value={editFormData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Last Name</label>
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
        </Modal>
      )}

      {isChangingPassword && (
        <Modal onClose={() => setIsChangingPassword(false)}>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {["currentPassword", "newPassword", "confirmPassword"].map((field, index) => (
              <div key={index} className="relative">
                <label className="block text-gray-700 font-semibold capitalize">
                  {field.replace(/([A-Z])/g, " $1")}:
                </label>
                <input
                  type={passwordVisibility[field] ? "text" : "password"}
                  name={field}
                  value={passwordFormData[field]}
                  onChange={handlePasswordInputChange}
                  className="w-full px-4 py-2 border rounded-lg text-sm sm:text-base"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility(field)}
                  className="absolute right-3 top-9 text-gray-600 focus:outline-none"
                >
                  {passwordVisibility[field] ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            ))}
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsChangingPassword(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                Change Password
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showSuccessModal && (
        <SuccessModal
          message="Your password has been successfully updated."
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
};

export default ViewProfile;

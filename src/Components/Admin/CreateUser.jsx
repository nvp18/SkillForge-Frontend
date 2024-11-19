import React, { useState } from "react";
import apiClient from "../../apiClient";

const CreateUser = () => {
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      userName,
      firstName,
      lastName,
      email,
    };

    const token = localStorage.getItem("token");

    try {
      const response = await apiClient.post("/api/user/createUser", userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        setModalMessage("User successfully added.");
        setSuccessModalOpen(true);
        resetForm();
      }
    } catch (err) {
      setModalMessage(
        err.response?.data?.message || "An error occurred. Please try again."
      );
      setErrorModalOpen(true);
    }
  };

  const resetForm = () => {
    setUserName("");
    setFirstName("");
    setLastName("");
    setEmail("");
  };

  const closeModals = () => {
    setSuccessModalOpen(false);
    setErrorModalOpen(false);
  };

  return (
    <div className="min-h-[88vh] flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">
        <h1 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-6">
          Create New User
        </h1>
        <form onSubmit={handleSubmit} data-testid="create-user-form">
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2 text-sm md:text-base"
              htmlFor="username"
            >
              User Name
            </label>
            <input
              type="text"
              id="username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="w-full px-3 py-2 md:px-4 md:py-3 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="username-input"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2 text-sm md:text-base"
              htmlFor="firstName"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full px-3 py-2 md:px-4 md:py-3 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="firstname-input"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2 text-sm md:text-base"
              htmlFor="lastName"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full px-3 py-2 md:px-4 md:py-3 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="lastname-input"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2 text-sm md:text-base"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 md:px-4 md:py-3 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="email-input"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 md:py-3 md:px-8 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="submit-button"
            >
              Create User
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {successModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          data-testid="success-modal"
        >
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm">
            <h2 className="text-base md:text-lg font-semibold text-center mb-4">
              {modalMessage}
            </h2>
            <button
              onClick={closeModals}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md w-full"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          data-testid="error-modal"
        >
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm">
            <h2 className="text-base md:text-lg font-semibold text-center mb-4">
              {modalMessage}
            </h2>
            <button
              onClick={closeModals}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md w-full"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateUser;

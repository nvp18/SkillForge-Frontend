import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../apiClient"; // API client remains

export const fetchUsersData = async (setUsers, setError) => {
  const token = localStorage.getItem("token");
  try {
    const response = await apiClient.get("/api/user/getAllEmployees", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUsers(response.data); // Use the fetched users
  } catch (err) {
    setError(err.response?.data?.message || "Failed to fetch users.");
  }
};

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsersData(setUsers, setError); // Extracted logic for testing
  }, []);

  if (error) return <p data-testid="error-message" className="text-red-500">{error}</p>;

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-[90vh]">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#342056] mb-6 sm:mb-8 text-center sm:text-left">
        All Users
      </h1>
      {users.length === 0 && !error && <p data-testid="no-users" className="text-center text-gray-700">No users found.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            data-testid="user-card"
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
            onClick={() => navigate(`/user/${user.id}`)}
          >
            <p>{user.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;

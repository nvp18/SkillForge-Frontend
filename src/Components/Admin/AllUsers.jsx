import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../apiClient";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await apiClient.get("/api/user/getAllEmployees", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        // Axios automatically parses JSON and throws on non-2xx status codes
        setUsers(response.data); // Access the response data directly
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-[90vh]">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#342056] mb-6 sm:mb-8 text-center sm:text-left">
        All Users
      </h1>
      {users.length === 0 && <p className="text-center text-gray-700">No users found.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {users.map((user) => (
          <div
            key={user.userId}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
            onClick={() => navigate(`/users/${user.userId}/manageCourses`)}
          >
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{user.userName}</h2>
            <p className="text-sm sm:text-base text-gray-600">
              <strong>First Name:</strong> {user.firstName || "N/A"}
            </p>
            <p className="text-sm sm:text-base text-gray-600">
              <strong>Last Name:</strong> {user.lastName || "N/A"}
            </p>
            <p className="text-sm sm:text-base text-gray-600">
              <strong>Email:</strong> {user.email || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;

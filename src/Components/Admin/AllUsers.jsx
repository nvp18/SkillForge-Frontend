import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:8080/api/user/getAllEmployees", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          throw new Error("Failed to fetch users.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-[90vh]">
      <h1 className="text-3xl font-bold text-[#342056] mb-8">All Users</h1>
      {users.length === 0 && <p>No users found.</p>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => (
          <div
            key={user.userId}
            className="bg-white p-6 rounded-lg shadow-lg cursor-pointer"
            onClick={() => navigate(`/users/${user.userId}/manageCourses`)}
          >
            <h2 className="text-xl font-bold text-gray-800">{user.userName}</h2>
            <p className="text-gray-600">First Name: {user.firstName || "N/A"}</p>
            <p className="text-gray-600">Last Name: {user.lastName || "N/A"}</p>
            <p className="text-gray-600">Email: {user.email || "N/A"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;

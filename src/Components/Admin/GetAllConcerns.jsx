// GetAllConcerns.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GetAllConcerns = () => {
  const [concerns, setConcerns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConcerns = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:8080/api/admin/getAllConcerns", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setConcerns(data);
        } else {
          throw new Error("Failed to fetch concerns.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConcerns();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-8 min-h-[80vh] bg-gray-50">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Concerns</h1>
        <p className="text-gray-600">List of all submitted concerns</p>
      </header>

      <div className="grid gap-5">
        {concerns.map((concern) => (
          <div
            key={concern.id}
            className="bg-white p-5 rounded-lg shadow-md flex justify-between items-center cursor-pointer"
            onClick={() => navigate(`/admin/concerns/${concern.id}`)}
          >
            <h2 className="text-lg font-bold text-gray-800">{concern.subject}</h2>
            <span
              className={`py-1 px-3 rounded-full text-sm font-bold ${
                concern.status === "NOT_READ" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
              }`}
            >
              {concern.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetAllConcerns;

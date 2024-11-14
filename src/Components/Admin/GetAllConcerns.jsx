import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GetAllConcerns = () => {
  const [concerns, setConcerns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRaiseConcernModal, setShowRaiseConcernModal] = useState(false);
  const [concernData, setConcernData] = useState({
    subject: "",
    description: "",
  });
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();
  const [role, setRole] = useState(""); // To track user role

  useEffect(() => {
    const fetchConcerns = async () => {
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("role"); // Assuming role is stored in localStorage
      setRole(userRole);

      const apiUrl =
        userRole === "admin"
          ? "http://localhost:8080/api/admin/getAllConcerns"
          : "http://localhost:8080/api/employee/getConcerns";

      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
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

  const handleRaiseConcern = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8080/api/employee/raiseConcern", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(concernData),
      });

      if (response.ok) {
        setModalMessage("Concern raised successfully.");
        setConcernData({ subject: "", description: "" });
        setShowRaiseConcernModal(false);
        setConcerns((prev) => [
          { id: Date.now(), subject: concernData.subject, status: "NOT_READ" },
          ...prev,
        ]);
      } else {
        throw new Error("Failed to raise concern.");
      }
    } catch (err) {
      setModalMessage(err.message || "Failed to raise concern.");
    }
  };

  const closeModal = () => {
    setShowRaiseConcernModal(false);
    setModalMessage("");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 sm:p-8 min-h-[80vh] bg-gray-50 relative">
      <header className="mb-4 sm:mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">Concerns</h1>
          <p className="text-sm sm:text-base text-gray-600">List of all submitted concerns</p>
        </div>
        {role === "EMPLOYEE" && (
          <button
            onClick={() => setShowRaiseConcernModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Raise a Concern
          </button>
        )}
      </header>

      <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
        {concerns.map((concern) => (
          <div
            key={concern.id}
            className="bg-white p-4 sm:p-5 rounded-lg shadow-md flex justify-between items-center cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/${role.toLowerCase()}/concerns/${concern.id}`)}
          >
            <h2 className="text-base sm:text-lg font-bold text-gray-800">{concern.subject}</h2>
            <span
              className={`py-1 px-2 sm:py-1 sm:px-3 rounded-full text-xs sm:text-sm font-bold ${
                concern.status === "NOT_READ"
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {concern.status}
            </span>
          </div>
        ))}
      </div>

      {/* Raise Concern Modal */}
      {showRaiseConcernModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Raise a Concern</h2>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold">Subject:</label>
                <input
                  type="text"
                  value={concernData.subject}
                  onChange={(e) => setConcernData({ ...concernData, subject: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Description:</label>
                <textarea
                  value={concernData.description}
                  onChange={(e) =>
                    setConcernData({ ...concernData, description: e.target.value })
                  }
                  rows="4"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeModal}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRaiseConcern}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success/Error Modal */}
      {modalMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md">
            <p className="text-gray-800">{modalMessage}</p>
            <button
              onClick={() => setModalMessage("")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAllConcerns;

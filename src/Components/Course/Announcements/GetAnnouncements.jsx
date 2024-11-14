import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CourseSidebar from "../CourseSidebar";

const Announcements = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(""); // To determine if the user is admin or employee

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("role"); // Assuming role is stored in localStorage
      setRole(userRole);

      const apiUrl =
        userRole === "ADMIN"
          ? `http://localhost:8080/api/admin/getAllAnnouncements/${courseId}`
          : `http://localhost:8080/api/employee/getAllAnnouncements/${courseId}`;

      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Sort announcements by date, newest first
          const sortedAnnouncements = data.sort(
            (a, b) => new Date(b.createdat) - new Date(a.createdat)
          );
          setAnnouncements(sortedAnnouncements);
        } else {
          throw new Error("Failed to fetch announcements.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAnnouncements();
  }, [courseId]);

  return (
    <div className="flex">
      <CourseSidebar />
      <div className="flex-1 ml-64 md:ml-60 p-4 sm:p-8 bg-gray-50 min-h-[88vh]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#342056]">Announcements</h1>
          {role === "ADMIN" && (
            <button
              onClick={() => navigate(`/course/${courseId}/addAnnouncement`)}
              className="bg-[#368e8f] hover:bg-[#5aa5a8] text-white font-bold py-2 px-4 rounded mt-4 sm:mt-0"
            >
              Add Announcement
            </button>
          )}
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {/* Announcements List */}
        <div>
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white p-4 mb-4 rounded-lg shadow-md flex flex-col sm:flex-row sm:justify-between sm:items-center"
            >
              <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                <h2
                  className="text-lg sm:text-xl font-semibold text-gray-800 cursor-pointer"
                  onClick={() =>
                    navigate(`/course/${courseId}/announcement/${announcement.id}`)
                  }
                >
                  {announcement.title}
                </h2>
              </div>
              <div className="text-right">
                <p className="text-gray-500">Posted on:</p>
                <p className="text-gray-800 font-semibold">
                  {new Date(announcement.createdat).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Announcements;

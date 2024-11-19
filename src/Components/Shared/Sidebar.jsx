import React, { useEffect, useState } from "react";
import { FaBars, FaBell, FaBook, FaHome, FaSignOutAlt, FaUser, FaUserCircle, FaUserPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const role = localStorage.getItem("role"); // Get role from local storage

  // Toggle collapse
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Check screen size to determine mobile view
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
    if (window.innerWidth < 768) {
      setIsCollapsed(true); // Auto-collapse on small screens
    } else {
      setIsCollapsed(false); // Expand on larger screens
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-[15vw] max-w-[250px]"
      } bg-[#333333] text-white h-screen p-4 transition-width duration-300 fixed top-0 left-0 flex flex-col justify-between`}
    >
      <div>
        {/* Toggle Button */}
        <div className="flex justify-end">
          <button
            onClick={toggleSidebar}
            className="text-gray-200 focus:outline-none"
          >
            <FaBars size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="mt-10">
          <ul className="space-y-4">
            {/* Dashboard */}
            <li>
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 hover:bg-[#F7E8A4] p-2 rounded transition duration-300"
              >
                <FaHome size={24} />
                {!isCollapsed && <span>Dashboard</span>}
              </Link>
            </li>

            {/* Admin-only items */}
            {role === "ADMIN" && (
              <>
                <li>
                  <Link
                    to="/admin/create-course"
                    className="flex items-center space-x-2 hover:bg-[#F7E8A4] p-2 rounded transition duration-300"
                  >
                    <FaBook size={24} />
                    {!isCollapsed && <span>Create Course</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/create-user"
                    className="flex items-center space-x-2 hover:bg-[#F7E8A4] p-2 rounded transition duration-300"
                  >
                    <FaUserPlus size={24} />
                    {!isCollapsed && <span>Create User</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/allUsers"
                    className="flex items-center space-x-2 hover:bg-[#F7E8A4] p-2 rounded transition duration-300"
                  >
                    <FaUser size={24} />
                    {!isCollapsed && <span>All Users</span>}
                  </Link>
                </li>
              </>
            )}

            {/* Common items for both Admin and Employee */}
            <li>
              <Link
                to="/concerns"
                className="flex items-center space-x-2 hover:bg-[#F7E8A4] p-2 rounded transition duration-300"
              >
                <FaBell size={24} />
                {!isCollapsed && <span>Concerns</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="flex items-center space-x-2 hover:bg-[#F7E8A4] p-2 rounded transition duration-300"
              >
                <FaUserCircle size={24} />
                {!isCollapsed && <span>Profile</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Logout Button */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 hover:bg-[#D9534F] p-2 rounded w-full text-left transition duration-300"
        >
          <FaSignOutAlt size={24} color="red" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

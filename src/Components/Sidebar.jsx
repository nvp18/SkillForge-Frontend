import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaHome, FaUserCircle, FaSignOutAlt } from "react-icons/fa";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Toggle collapse
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } bg-gray-800 text-white h-screen p-4 transition-width duration-300 fixed flex flex-col justify-between`}
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
            {/* Home Button */}
            <li>
              <Link
                to="/employee-dashboard"
                className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded"
              >
                <FaHome size={24} />
                {!isCollapsed && <span>Home</span>}
              </Link>
            </li>
            {/* Profile Button */}
            <li>
              <Link
                to="/view-profile"
                className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded"
              >
                <FaUserCircle size={24} />
                {!isCollapsed && <span>Profile</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Logout Button at the Bottom */}
      <div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded w-full text-left"
        >
          <FaSignOutAlt size={24} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

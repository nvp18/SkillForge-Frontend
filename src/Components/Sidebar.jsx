import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaHome, FaUserCircle, FaSignOutAlt, FaTasks, FaBell } from "react-icons/fa";

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
      } bg-[#333333] text-white h-screen p-4 transition-width duration-300 fixed flex flex-col justify-between`}
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
                to="/dashboard"
                className="flex items-center space-x-2 hover:bg-[#F7E8A4] p-2 rounded transition duration-300"
              >
                <FaHome size={24} />
                {!isCollapsed && <span>Dashboard</span>}
              </Link>
            </li>
            
            {/* Profile Button */}
            <li>
              <Link
                to="/profile"
                className="flex items-center space-x-2 hover:bg-[#F7E8A4] p-2 rounded transition duration-300"
              >
                <FaUserCircle size={24} />
                {!isCollapsed && <span>Profile</span>}
              </Link>
            </li>
            
            {/* Projects Button */}
            <li>
              <Link
                to="/assignments"
                className="flex items-center space-x-2 hover:bg-[#F7E8A4] p-2 rounded transition duration-300"
              >
                <FaTasks size={24} />
                {!isCollapsed && <span>Assignments</span>}
              </Link>
            </li>
            
            {/* Notifications Button */}
            <li>
              <Link
                to="/notifications"
                className="flex items-center space-x-2 hover:bg-[#F7E8A4] p-2 rounded transition duration-300"
              >
                <FaBell size={24} />
                {!isCollapsed && <span>Notifications</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Logout Button at the Bottom */}
      <div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 hover:bg-[#D9534F] p-2 rounded w-full text-left transition duration-300"
        >
          <FaSignOutAlt size={24} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

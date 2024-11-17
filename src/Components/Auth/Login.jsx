import axios from 'axios';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/Logo.svg';
import './Login.css'; // Ensure your custom styles (if any) are included
import apiClient from '../../apiClient'; // Use your configured Axios instance

const Login = () => {
  const [userName, setuserName] = useState(''); 
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();


const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await apiClient.post('/api/user/login', {
      userName, 
      password,
    });

    console.log(response.data);
    const { Token, Role } = response.data;

    // Store token and role in localStorage
    localStorage.setItem('token', Token);
    localStorage.setItem('role', Role);

    // Navigate based on role
    if (Role === 'ADMIN' || Role === 'EMPLOYEE') {
      navigate('/dashboard');
    }
  } catch (error) {
    console.error(error);
    setErrorMessage(error.response?.data?.message || 'Login failed. Please check your credentials.');
  }
};


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg w-96 p-6">
        <div className="text-center mb-6">
          <img src={logo} alt="SkillForge Company Logo" className="mx-auto w-72 h-72" />
        </div>

        {/* Updated Welcome Text */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700">
            Welcome to SkillForge, where your growth continues.
          </h2>
          <p className="text-gray-600 mt-2">
            <span className="text-customYellow font-semibold">Sign in</span> to access your personalized dashboard and continue learning.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-1 text-gray-600">Username</label> 
            <input
              type="text" 
              value={userName}
              onChange={(e) => setuserName(e.target.value)} 
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div className="mb-4 relative">
            <label className="block mb-1 text-gray-600">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'} // Toggle between text and password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 pr-10" // Add padding for icon
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)} // Toggle show/hide
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Eye icons */}
              </button>
            </div>
          </div>

          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

          <button
            type="submit"
            className="w-full bg-customYellow text-white py-2 rounded-lg hover:bg-customYellow-hover transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

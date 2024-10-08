import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Ensure your custom styles (if any) are included
import logo from '../assets/logo.svg';

const Login = () => {
  const [email, setEmail] = useState(''); // Changed from userName to email
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/user/login', {
        email, // Changed userName to email
        password,
      });
      const { Token, Role } = response.data;
      localStorage.setItem('token', Token);
      localStorage.setItem('role', Role);
      console.log(Token, Role);
      if (Role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else if (Role === 'EMPLOYEE') {
        navigate('/employee-dashboard');
      }
    } catch (error) {
      setErrorMessage('Login failed. Please check your credentials.');
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
            <label className="block mb-1 text-gray-600">Email</label> {/* Changed label */}
            <input
              type="email" // Updated input type
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Changed userName to email
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
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

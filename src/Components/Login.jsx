import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/user/login', {
        userName,
        password,
      });
    const { Token, Role } = response.data;
    localStorage.setItem('token', Token);
    localStorage.setItem('role', Role); // Store user role
    console.log(Token,Role)
        if (Role === 'ADMIN') {
            navigate('/admin-dashboard'); // Redirect to admin dashboard
          } else if (Role === 'EMPLOYEE') {
            navigate('/employee-dashboard'); // Redirect to user dashboard
          }
    } catch (error) {
      setErrorMessage('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label>Username:</label>
          <input
            type="string"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="input"
          />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
        </div>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;

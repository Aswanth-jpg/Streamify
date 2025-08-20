import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './userLogin.css';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        role: 'user',
      });

      const { token } = response.data;
      if (!token) {
        throw new Error('Invalid response from server');
      }

      const decoded = jwtDecode(token);
      if (decoded.role !== 'user') {
        setError('Please use the correct portal for your role.');
        return;
      }

      localStorage.setItem('authToken', token);
      navigate('/user/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <button 
          onClick={() => navigate('/')} 
          className="home-button"
        >
          ← Home
        </button>
        <h2>User Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Login</button>
        <div className="signup-link">
          <span>New here?</span>
          <button type="button" onClick={() => navigate('/user/signup')} className="signup-button">Create an account</button>
        </div>
      </form>
    </div>
  );
};

export default UserLogin;


import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';
import '../css/login.css'; // Assuming you will create this file for LoginPage

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState('');

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors('');
    try {
      const data = await authService.login(formData);
      login(data.token);
    } catch (err) {
      setErrors(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="login-page-wrapper">
      <div id="login-page">
        <h2 id="login-heading">Welcome to SafeMind</h2>
        <p className="tagline">Your personal mental wellness companion</p>
        
        {errors && <div id="error-message" className="error">{errors}</div>}
        <div id="login-container" className="login-container">
          <form id="login-form" onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="email-input">Email Address</label>
              <input
                id="email-input"
                type="email"
                placeholder="Email Address"
                name="email"
                value={formData.email}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password-input">Password</label>
              <input
                id="password-input"
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={onChange}
                required
              />
            </div>
            <button id="login-btn" type="submit">Sign In</button>
            <div className="form-footer">
              <p>Don't have an account? <a href="/register">Create Account</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;

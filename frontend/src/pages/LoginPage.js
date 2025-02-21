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

  return (<div>
    <h2 id="login-heading">Login</h2>
    <div id="login-page">
      
      {errors && <div id="error-message" className="error">{errors}</div>}
      <div id="login-container" className="login-container">
        <form id="login-form" onSubmit={onSubmit}>
          <input
            id="email-input"
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={onChange}
            required
          />
          <input
            id="password-input"
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={onChange}
            required
          />
          <button id="login-btn" type="submit">Login</button>
        </form>
      </div>
    </div></div>
  );
};

export default LoginPage;

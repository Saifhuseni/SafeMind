import React, { useState } from 'react';
import authService from '../services/authService';
import '../css/register.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    gender: 'Other',
    contact: '',
    bio: '',
    age: '',
  });
  const [errors, setErrors] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors('');
    setSuccessMessage('');
    try {
      await authService.register(formData);
      setSuccessMessage('Registration successful. Please log in.');
    } catch (err) {
      setErrors(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (<div><h2 id="register-heading">Register</h2>
    <div id="register-page">
      
      <div id="register-container" className="register-container">
        
        {errors && <div id="error-message" className="error">{errors}</div>}
        {successMessage && <div id="success-message" className="success">{successMessage}</div>}
        
        <form id="register-form" onSubmit={onSubmit}>
          <input
            id="username-input"
            type="text"
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={onChange}
            required
          />
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
          <input
            id="name-input"
            type="text"
            placeholder="Full Name"
            name="name"
            value={formData.name}
            onChange={onChange}
          />
          <select
            id="gender-select"
            name="gender"
            value={formData.gender}
            onChange={onChange}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            id="contact-input"
            type="text"
            placeholder="Contact"
            name="contact"
            value={formData.contact}
            onChange={onChange}
          />
          <textarea
            id="bio-textarea"
            placeholder="Bio"
            name="bio"
            value={formData.bio}
            onChange={onChange}
          />
          <input
            id="age-input"
            type="number"
            placeholder="Age"
            name="age"
            value={formData.age}
            onChange={onChange}
            required
          />
          <button id="register-btn" type="submit">Register</button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default RegisterPage;

import React, { useState } from 'react';
import authService from '../services/authService';
import '../css/register.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    gender: 'Male', // Set a default value
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
    
    // Form validation
    if (formData.password.length < 6) {
      setErrors('Password must be at least 6 characters long');
      return;
    }
    
    try {
      const response = await authService.register(formData);
      console.log('Registration successful:', response);
      setSuccessMessage('Registration successful. Please log in.');
      // Clear form after successful registration
      setFormData({
        username: '',
        email: '',
        password: '',
        name: '',
        gender: 'Male',
        contact: '',
        bio: '',
        age: '',
      });
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response && err.response.data) {
        // Handle array of errors from express-validator
        if (Array.isArray(err.response.data.errors)) {
          const errorMessages = err.response.data.errors.map(error => error.msg).join(', ');
          setErrors(errorMessages);
        } else {
          // Handle single error message
          setErrors(err.response.data.msg || 'Registration failed');
        }
      } else {
        setErrors('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="register-page-wrapper">
      <div className="register-content-wrapper">
        <div id="register-page">
          <div id="register-container" className="register-container">
            {errors && <div id="error-message" className="error">{errors}</div>}
            {successMessage && <div id="success-message" className="success">{successMessage}</div>}
            <form id="register-form" onSubmit={onSubmit}>
              <div>
                <label htmlFor="username-input">Username *</label>
                <input
                  id="username-input"
                  type="text"
                  placeholder="John123"
                  name="username"
                  value={formData.username}
                  onChange={onChange}
                  required
                  minLength="3"
                  maxLength="25"
                />
              </div>
              <div>
                <label htmlFor="email-input">Email *</label>
                <input
                  id="email-input"
                  type="email"
                  placeholder="abc@abc.com"
                  name="email"
                  value={formData.email}
                  onChange={onChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="password-input">Password *</label>
                <input
                  id="password-input"
                  type="password"
                  placeholder="Password (min 6 characters)"
                  name="password"
                  value={formData.password}
                  onChange={onChange}
                  required
                  minLength="6"
                />
              </div>
              <div>
                <label htmlFor="name-input">Full Name *</label>
                <input
                  id="name-input"
                  type="text"
                  placeholder="John Doe"
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                  required
                  maxLength="50"
                />
              </div>
              <div>
                <label htmlFor="gender-select">Gender *</label>
                <select
                  id="gender-select"
                  name="gender"
                  value={formData.gender}
                  onChange={onChange}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="contact-input">Contact </label>
                <input
                  id="contact-input"
                  type="tel"
                  placeholder="9876543210"
                  name="contact"
                  value={formData.contact}
                  required
                  pattern="^\d{10}$"
                  title="Contact number must be exactly 10 digits."
                  onChange={onChange}
                />
              </div>
              <div>
                <label htmlFor="bio-textarea">Bio (optional, max 200 chars)</label>
                <textarea
                  id="bio-textarea"
                  placeholder="I love playing chess"
                  name="bio"
                  value={formData.bio}
                  onChange={onChange}
                  maxLength="200"
                />
              </div>
              <div>
                <label htmlFor="age-input">Age</label>
                <input
                  id="age-input"
                  type="number"
                  placeholder="20"
                  name="age"
                  value={formData.age}
                  onChange={onChange}
                  min="1"
                  max="120"
                  title="Age should be between 1 and 120"
                  required
                />
              </div>
              <button id="register-btn" type="submit">Register</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
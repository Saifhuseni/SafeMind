import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Male');
  const [contact, setContact] = useState('');
  const [bio, setBio] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await API.get('/users/profile');
        setUser(res.data);
        setUsername(res.data.username || '');
        setName(res.data.name || '');
        setGender(res.data.gender || 'Male');
        setContact(res.data.contact || '');
        setBio(res.data.bio || '');
        setAge(res.data.age || '');
        setEmail(res.data.email || '');
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Form validation checks
    const validationErrors = [];
    if (username.length < 3 || username.length > 25) {
      validationErrors.push('Username must be between 3 and 25 characters.');
    }
    if (!email.includes('@')) {
      validationErrors.push('Please enter a valid email address.');
    }
    if (password && password.length < 6) {
      validationErrors.push('Password must be at least 6 characters long.');
    }
    if (password && password !== confirmPassword) {
      validationErrors.push('Passwords do not match.');
    }
    if (contact && !/^\d{10}$/.test(contact)) {
      validationErrors.push('Contact number must be exactly 10 digits.');
    }
    if (age < 1 || age > 120) {
      validationErrors.push('Age should be between 1 and 120.');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors.join(' '));
      return;
    }

    const updatedUser = {
      username,
      name,
      gender,
      contact,
      bio,
      age,
      email,
      password,
    };
     
    try {
      const res = await API.put('/users/profile', updatedUser);
      setSuccessMessage('Profile updated successfully');
      setUser(res.data.user);
      navigate('/dashboard');
    } catch (err) {
        console.error('Error updating profile:', err);
    
        // Handle error from the backend (e.g., duplicate username or email)
        if (err.response && err.response.data && err.response.data.msg) {
          setErrors(err.response.data.msg); // Display backend error message
        } else {
          setErrors('An error occurred while updating the profile.');
        }}
  };

  return (
    <div id="register-page">
      <div id="register-container" className="register-container">
        {errors && <div id="error-message" className="error">{errors}</div>}
        {successMessage && <div id="success-message" className="success">{successMessage}</div>}

        <form id="register-form" onSubmit={handleUpdate}>
          {/* Update Personal Details Section */}
          <section className="update-personal-details">
            <h2>Update Personal Details</h2>

            <div>
              <label htmlFor="username-input">Username *</label>
              <input
                id="username-input"
                type="text"
                placeholder="John123"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="name-input">Full Name *</label>
              <input
                id="name-input"
                type="text"
                placeholder="John Doe"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength="50"
              />
            </div>

            <div>
              <label htmlFor="gender-select">Gender *</label>
              <select
                id="gender-select"
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="contact-input">Contact</label>
              <input
                id="contact-input"
                type="tel"
                placeholder="9876543210"
                name="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                pattern="^\d{10}$"
                title="Contact number must be exactly 10 digits."
              />
            </div>

            <div>
              <label htmlFor="bio-textarea">Bio (optional, max 200 chars)</label>
              <textarea
                id="bio-textarea"
                placeholder="I love playing chess"
                name="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
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
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="1"
                max="120"
                title="Age should be between 1 and 120"
                required
              />
            </div>
          </section>

          {/* Update Password Section */}
          <section className="update-password">
            <h2>Update Password</h2>

            <div>
              <label htmlFor="password-input">New Password</label>
              <input
                id="password-input"
                type="password"
                placeholder="Password (min 6 characters)"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength="6"
              />
            </div>

            <div>
              <label htmlFor="confirm-password-input">Confirm Password</label>
              <input
                id="confirm-password-input"
                type="password"
                placeholder="Confirm your password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </section>

          <button type="submit">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;

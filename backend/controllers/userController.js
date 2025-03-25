const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  const { username, name, gender, contact, bio, age, email, password } = req.body;

  try {
    let user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Check if username or email is updated, and validate them
    if (username && username !== user.username) {
      // Check if the username is already taken
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ msg: 'Username already taken' });
      }
    }

    if (email && email !== user.email) {
      // Check if the email is already used
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ msg: 'Email is already in use' });
      }
    }

    // Update fields only if provided
    user.username = username || user.username;
    user.name = name || user.name;
    user.gender = gender || user.gender;
    user.contact = contact || user.contact;
    user.bio = bio || user.bio;
    user.age = age || user.age;
    user.email = email || user.email;

    // If a new password is provided, hash it before saving
    if (password) {
      
      user.password = password;
    }

    await user.save(); // Save changes to the database

    res.json({
      msg: 'Profile updated successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email, 
        name: user.name,
        gender: user.gender,
        contact: user.contact,
        bio: user.bio,
        age: user.age,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

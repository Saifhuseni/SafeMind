const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {
  const { username, email, password, name, gender, contact, bio, age } = req.body;
console.log(" register input password is",password)
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    let existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ msg: 'Username already exists' });
    } 
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(' register Hashed Password:', hashedPassword);

    user = new User({
      username,
      email,
      password,
      name,
      gender,
      contact,
      bio,
      age,
    });

    await user.save();

    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
    };

    const token = jwt.sign(payload, config.get('JWT_SECRET'), { expiresIn: '1h' });

    res.status(201).json({
      token,
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
    console.error('Register Error:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: email }, { username: email }]
    });

    if (!user) {
      console.log('User not found with email/username:', email);
      return res.status(400).json({ msg: 'No User Found with this Email or Username. Please Register' });
    }

    console.log('Stored Hashed Password:', user.password);
    console.log('Entered Password:', password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password Match:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
    };

    const token = jwt.sign(payload, config.get('JWT_SECRET'), { expiresIn: '1h' });

    res.json({
      token,
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
    console.error('Login Error:', err.message);
    res.status(500).send('Server Error');
  }
};
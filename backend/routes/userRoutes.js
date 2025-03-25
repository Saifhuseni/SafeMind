const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/users/profile - Get profile
router.get('/profile', authMiddleware, getUserProfile);

// PUT /api/users/profile - Update profile
router.put('/profile', authMiddleware, updateUserProfile);

module.exports = router;

// routes/moodLogRoutes.js
const express = require('express');
const router = express.Router();
const MoodLog = require('../models/MoodLog');

// POST /api/mood-logs - Create or update a mood log for a specific day
router.post('/', async (req, res) => {
  try {
    const { userId, mood, description, date } = req.body;

    if (!userId || !mood || !description || !date) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Convert date to start of the day (ignoring time)
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    // Check if a mood log already exists for this user on the same day
    const existingLog = await MoodLog.findOne({
      userId,
      date: { $gte: startOfDay, $lt: new Date(startOfDay.getTime() + 86400000) } // Find within the same day range
    });

    if (existingLog) {
      // Update existing mood log
      existingLog.mood = mood;
      existingLog.description = description;
      existingLog.date = new Date(date); // Update with new timestamp
      await existingLog.save();
      return res.status(200).json({ message: 'Mood log updated successfully!' });
    } else {
      // Create new mood log
      const newMoodLog = new MoodLog({
        userId,
        mood,
        description,
        date: new Date(date),
      });

      await newMoodLog.save();
      return res.status(201).json({ message: 'Mood log created successfully!' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving mood log' });
  }
});

module.exports = router;

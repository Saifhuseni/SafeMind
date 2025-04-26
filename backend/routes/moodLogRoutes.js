// routes/moodLogRoutes.js
const express = require("express");
const router = express.Router();
const MoodLog = require("../models/MoodLog");

// POST /api/mood-logs - Create or update a mood log for a specific day
router.post("/", async (req, res) => {
  try {
    const { userId, mood, description, date } = req.body;

    if (!userId || !mood || !description || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Convert date to start of the day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const existingLog = await MoodLog.findOne({
      userId,
      date: { $gte: startOfDay, $lt: new Date(startOfDay.getTime() + 86400000) },
    });

    if (existingLog) {
      existingLog.mood = mood;
      existingLog.description = description;
      existingLog.date = new Date(date);
      await existingLog.save();
      return res.status(200).json({ message: "Mood log updated successfully!" });
    } else {
      const newMoodLog = new MoodLog({ userId, mood, description, date: new Date(date) });
      await newMoodLog.save();
      return res.status(201).json({ message: "Mood log created successfully!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving mood log" });
  }
});

// GET /api/mood-logs/user/:userId - Fetch last 7 days' mood logs
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0); // Ensure midnight timestamp for 7 days ago

    const today = new Date();
    today.setHours(23, 59, 59, 999); // Ensure the timestamp is for the end of the current day

    console.log("Fetching data from:", sevenDaysAgo.toISOString(), "to", today.toISOString());

    const logs = await MoodLog.find({
      userId,
      date: { $gte: sevenDaysAgo, $lte: today },
    }).sort({ date: 1 });

    console.log("Logs found:", logs);
    res.json(logs);
  } catch (error) {
    console.error("Error fetching mood logs:", error);
    res.status(500).json({ message: "Error fetching mood logs" });
  }
});

module.exports = router;
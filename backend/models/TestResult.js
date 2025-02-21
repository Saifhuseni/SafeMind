const mongoose = require('mongoose');

const TestResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User Model
    required: true,
    ref: 'User', // Assuming you have a User model
    index: true
  },
  testType: {
    type: String,
    required: true,
    enum: ["ADHD", "PTSD", "GAD-7", "PHQ-9"], // Standard test names
    index: true
  },
  score: {
    type: Number,
    required: true
  },
  label: {
    type: String,
    required: true,
    enum: ["Normal", "Mild", "Moderate", "Moderately Severe", "Severe"] // Ensures consistency in labels
  },
  responses: {
    type: [Number], // Stores individual responses as an array of numbers
    required: true
  },
  dateTaken: {
    type: Date,
    default: Date.now
  }
});

// Removes unique constraint to allow multiple test attempts
TestResultSchema.index({ userId: 1, testType: 1 });

const TestResult = mongoose.model('TestResult', TestResultSchema);
module.exports = TestResult;

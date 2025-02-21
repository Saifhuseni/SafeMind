const express = require('express');
const router = express.Router();
const TestResult = require('../models/TestResult');
const authMiddleware = require('../middleware/authMiddleware');

const tests = {
  "ADHD": {
    title: "ADHD Test",
    questions: [
      "How often do you find it difficult to focus on tasks?",
      "How often do you lose things necessary for tasks?",
      "How often do you forget important commitments?",
      "How often do you interrupt others during conversations?",
      "How often do you feel restless?",
      "How often do you talk excessively?",
      "How often do you struggle to complete tasks?",
      "How often do you feel easily frustrated?",
      "How often do you struggle with time management?"
    ],
    scoring: [0, 1, 2, 3, 4]
  },
  "PTSD": {
    title: "PTSD Test",
    questions: [
      "Do you have memories of a traumatic event that you can't stop thinking about?",
      "Do you often have dreams about the traumatic event?",
      "Do reminders of the event upset you?",
      "Do you avoid thinking about the event?",
      "Do you feel disconnected from others?",
      "Do you often feel scared or guilty?",
      "Do you have trouble concentrating?",
      "Do you have trouble sleeping?"
    ],
    scoring: [0, 1, 2, 3, 4]
  },
  "GAD-7": {
    title: "Anxiety Test",
    questions: [
      "Do you feel nervous or anxious?",
      "Do you find it hard to stop worrying?",
      "Do you worry about different things?",
      "Do you have trouble relaxing?",
      "Do you feel restless?",
      "Do you get easily irritated?",
      "Do you feel afraid as if something bad might happen?"
    ],
    scoring: [0, 1, 2, 3]
  },
  "PHQ-9": {
    title: "Depression Test",
    questions: [
      "Little interest in doing things?",
      "Feeling down or hopeless?",
      "Trouble sleeping or sleeping too much?",
      "Feeling tired?",
      "Poor appetite or overeating?",
      "Feeling bad about yourself?",
      "Trouble concentrating?",
      "Moving or speaking very slow?",
      "Thoughts of hurting yourself?"
    ],
    scoring: [0, 1, 2, 3]
  }
};

const severityLabels = ["Normal", "Mild", "Moderate", "Moderately Severe", "Severe"];

const determineSeverity = (score, maxScore) => {
  const percentage = (score / maxScore) * 100;
  if (percentage < 20) return severityLabels[0];
  if (percentage < 40) return severityLabels[1];
  if (percentage < 60) return severityLabels[2];
  if (percentage < 80) return severityLabels[3];
  return severityLabels[4];
};

// GET available tests
router.get('/', authMiddleware, (req, res) => {
  res.json({ tests: Object.keys(tests) });
});

router.get('/all-tests', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch all test results for the user
    const testResults = await TestResult.find({ userId }).sort({ dateTaken: -1 });

    if (!testResults.length) {
      return res.status(404).json({ error: 'No test results found' });
    }

    res.json(testResults);
  } catch (error) {
    console.error('Error fetching test results:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// GET test details
router.get('/:testType', authMiddleware, (req, res) => {
  const { testType } = req.params;
  if (!tests[testType]) return res.status(404).json({ error: 'Test type not found' });
  res.json({ testType, test: tests[testType] });
});

// POST test submission
router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { testType, responses } = req.body;
    const test = tests[testType];

    // Calculate total score and severity level
    const totalScore = responses.reduce((sum, score) => sum + score, 0);
    const maxScore = test.scoring[test.scoring.length - 1] * test.questions.length;
    const severityLabel = determineSeverity(totalScore, maxScore);

    // Create or update the test result
    const userId = req.user.userId;
    const existingTestResult = await TestResult.findOne({ userId, testType });

    if (existingTestResult) {
      existingTestResult.score = totalScore;
      existingTestResult.label = severityLabel;
      existingTestResult.responses = responses;
      await existingTestResult.save();

      res.json({
        message: 'Test updated successfully',
        testType,
        score: totalScore,
        severity: severityLabel,
        resultId: existingTestResult._id
      });
    } else {
      const testResult = new TestResult({
        userId,
        testType,
        score: totalScore,
        label: severityLabel,
        responses,
      });
      await testResult.save();

      res.json({
        message: 'Test submitted successfully',
        testType,
        score: totalScore,
        severity: severityLabel,
        resultId: testResult._id
      });
    }
  } catch (error) {
    console.error('Error submitting test:', error);
    res.status(500).json({ error: 'Server error' });
  }
});




module.exports = router;

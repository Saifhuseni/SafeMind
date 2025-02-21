import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api'; // Import API instance from api.js
import { AuthContext } from '../context/AuthContext';
import '../css/TestPage.css'; // Add the imported CSS file

const TestPage = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [testType, setTestType] = useState('');
  const [questions, setQuestions] = useState([]);
  const [scoring, setScoring] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [isTakingTest, setIsTakingTest] = useState(false); // New state

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    // Fetch test results when the component mounts
    if (token) {
      API.get(`${API_URL}/tests/all-tests`)
        .then((response) => {
          setTestResults(response.data);
        })
        .catch((err) => {
          console.error('Error fetching test results:', err);
        });
    }
  }, [token]);

  useEffect(() => {
    if (testType && token) {
      setLoading(true);
      setIsTakingTest(true); // Set isTakingTest to true when a test is selected
      API.get(`${API_URL}/tests/${testType}`)
        .then((response) => {
          const { questions: fetchedQuestions, scoring: fetchedScoring } = response.data.test;
          setQuestions(fetchedQuestions);
          setScoring(fetchedScoring);
          setResponses(new Array(fetchedQuestions.length).fill(0));
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching test data:', err);
          setError('Error fetching test data');
          setLoading(false);
        });
    }
  }, [testType, token]);

  const handleResponseChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await API.post(`${API_URL}/tests/submit`, {
        testType,
        responses,
      });
  
      if (response.data.resultId) {
        // Navigate to the result page with resultId, score, and severity in state
        navigate(`/testresult/${response.data.resultId}`, {
          state: {
            score: response.data.score,
            severity: response.data.severity,
          }
        });
      } else {
        console.error("resultId is missing from response:", response.data);
        setError("Error processing test results. Please try again.");
      }
    } catch (err) {
      console.error('Error submitting test:', err.response ? err.response.data : err.message);
      setError('Error submitting test. Please try again.');
    }
  };

  const handleRetakeTest = (testResultId) => {
    const testResult = testResults.find(result => result._id === testResultId);
    setTestType(testResult.testType);
  };

  return (
    <div className="tests-container">
      {/* Only show these sections when not taking a test */}
      {!isTakingTest && (
        <>
          {/* Informative Section */}
          <section className="info-section">
            <h2>Mental Health Assessments</h2>
            <p>
              These tests provide general insights based on standard psychological assessments.
              They are not diagnostic tools. For a professional diagnosis, consult a licensed specialist.
            </p>
          </section>

          {/* Previous Test Results Section */}
          <section className="previous-results">
            <h3>Previously Taken Tests</h3>
            {testResults.length === 0 ? (
              <p>No previous test results found.</p>
            ) : (
              testResults.map((result) => (
                <div key={result._id} className="test-card">
                  <p>{result.testType}</p>
                  <p>Score: {result.score}</p>
                  <p>Severity: {result.label}</p>
                  <button onClick={() => handleRetakeTest(result._id)}>Retake Test</button>
                </div>
              ))
            )}
          </section>

          {/* Test Selection Section */}
          <section className="test-selection">
            <div className="test-box" onClick={() => setTestType("ADHD")}>
              <h4>ADHD Test</h4>
            </div>
            <div className="test-box" onClick={() => setTestType("PTSD")}>
              <h4>PTSD Test</h4>
            </div>
            <div className="test-box" onClick={() => setTestType("GAD-7")}>
              <h4>Anxiety Test (GAD-7)</h4>
            </div>
            <div className="test-box" onClick={() => setTestType("PHQ-9")}>
              <h4>Depression Test (PHQ-9)</h4>
            </div>
          </section>
        </>
      )}

      {/* Test Form */}
      {testType && !loading && questions.length > 0 && (
        <form onSubmit={handleSubmit}>
          <h3>{testType} Test</h3>
          {questions.map((question, index) => (
            <div key={index}>
              <p>{question}</p>
              {scoring.map((score) => (
                <label key={score}>
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={score}
                    checked={responses[index] === score}
                    onChange={() => handleResponseChange(index, score)}
                  />
                  {score}
                </label>
              ))}
            </div>
          ))}
          <button type="submit">Submit Test</button>
        </form>
      )}

      {/* Loading and Error Messages */}
      {loading && <p>Loading test...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default TestPage;

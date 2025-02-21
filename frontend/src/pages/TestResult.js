import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/TestResult.css'; // Import the new CSS file

const TestResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, severity } = location.state || {};

  const handleRedirectToHealingPage = () => {
    navigate('/healing');
  };

  return (
    <div className="test-result-container">
      <h2>Test Result</h2>
      {score != null && severity ? (
        <div className="result-details">
          <p><strong>Score:</strong> {score}</p>
          <p><strong>Severity Level:</strong> {severity}</p>
          <p>
            For a better understanding of your test results and to explore personalized healing options, 
            please visit the
          </p> <button onClick={handleRedirectToHealingPage}>Personalized Healing Page</button>
        </div>
      ) : (
        <p className="error-message">Error loading test result.</p>
      )}
    </div>
  );
};

export default TestResult;

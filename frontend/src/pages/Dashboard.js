import React, { useState } from "react";

const Dashboard = () => {
  const [mood, setMood] = useState(""); // User input
  const [prediction, setPrediction] = useState(""); // Prediction result

  // Function to send data to FastAPI backend
  const handleMoodSubmit = async () => {
    if (!mood.trim()) {
      alert("Please enter your mood description!");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/predict-mood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: mood }), // Sending user input
      });

      const data = await response.json();
      setPrediction(data.predicted_mood); // Update state with prediction

    } catch (error) {
      console.error("Error predicting mood:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to the Dashboard!</h1>
      <h2>How are you feeling today?</h2>

      <textarea
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        placeholder="Describe your mood..."
        rows="3"
        cols="50"
      ></textarea>
      <br />

      <button onClick={handleMoodSubmit} style={{ marginTop: "10px" }}>
        Predict Mood
      </button>

      {prediction && (
        <h3 style={{ marginTop: "20px" }}>
          Predicted Mood: <span style={{ color: "blue" }}>{prediction}</span>
        </h3>
      )}
    </div>
  );
};

export default Dashboard;

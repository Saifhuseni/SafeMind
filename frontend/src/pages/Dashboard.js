import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext

const Dashboard = () => {
  const [mood, setMood] = useState(""); // User input
  const [prediction, setPrediction] = useState(""); // Prediction result
  const { userId } = useContext(AuthContext); // Get the userId from AuthContext

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

      // Get the token from localStorage
      const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
      if (!token) {
        alert("You are not authenticated. Please log in.");
        return;
      }

      // Send the mood log to the backend API with the authorization header
      const moodLogResponse = await fetch("http://localhost:5000/api/mood-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Include the JWT token here
        },
        body: JSON.stringify({
          userId: userId, // Send userId from AuthContext
          mood: data.predicted_mood,
          description: mood,
          date: new Date().toISOString(), // Current date
        }),
      });

      if (moodLogResponse.ok) {
        console.log("Mood logged successfully!");
      } else {
        console.error("Failed to log mood.");
      }
    } catch (error) {
      console.error("Error predicting mood or saving mood log:", error);
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

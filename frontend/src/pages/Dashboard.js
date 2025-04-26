import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const Dashboard = () => {
  const [mood, setMood] = useState("");
  const [prediction, setPrediction] = useState("");
  const [moodData, setMoodData] = useState([]);
  const [maxStreak, setMaxStreak] = useState(0);
  const { userId } = useContext(AuthContext);

  // Fetch last 7 days' mood logs
  const fetchMoodLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/mood-logs/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      console.log("Mood Data from API:", data); // Debugging

      if (Array.isArray(data) && data.length > 0) {
        setMoodData(data);
        setMaxStreak(calculateMaxStreak(data)); // Calculate streak after fetching mood data
      } else {
        console.warn("No mood data found.");
        setMoodData([]);
        setMaxStreak(0); // Reset streak if no mood data
      }
    } catch (error) {
      console.error("Error fetching mood logs:", error);
      setMoodData([]);
      setMaxStreak(0); // Reset streak on error
    }
  };

  useEffect(() => {
    fetchMoodLogs();
  }, [userId]); // Re-fetch logs when the userId changes

  // Submit mood and save in DB
  const handleMoodSubmit = async () => {
    if (!mood.trim()) {
      alert("Please enter your mood description!");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/predict-mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: mood }),
      });

      const data = await response.json();
      setPrediction(data.predicted_mood);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not authenticated. Please log in.");
        return;
      }

      const moodLogResponse = await fetch("http://localhost:5000/api/mood-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          userId,
          mood: data.predicted_mood,
          description: mood,
          date: new Date().toISOString(),
        }),
      });

      if (moodLogResponse.ok) {
        console.log("Mood logged successfully!");
        // After logging the mood, refetch the data to update the chart
        fetchMoodLogs();
      } else {
        console.error("Failed to log mood.");
      }
    } catch (error) {
      console.error("Error predicting mood or saving mood log:", error);
    }
  };

  // Mood mapping for Y-axis
  const moodMapping = {
    anxiety: 1,
    bipolar: 2,
    depression: 3,
    normal: 4,
    "personality disorder": 5,
    stress: 6,
    suicidal: 7,
  };

  // Function to calculate the maximum streak of mood logs for the last 7 days
  const calculateMaxStreak = (logs) => {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 6); // 6 days ago, including today, is the 7-day window

    // Filter the logs to only include those from the last 7 days
    const filteredLogs = logs.filter((log) => {
      const logDate = new Date(log.date);
      return logDate >= sevenDaysAgo && logDate <= now;
    });

    // Sort the filtered logs by date (ascending)
    filteredLogs.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate the streak
    let maxStreak = 0;
    let currentStreak = 0;
    let previousDate = null;

    filteredLogs.forEach((log) => {
      const currentDate = new Date(log.date);
      if (!previousDate || isNextDay(previousDate, currentDate)) {
        currentStreak++;
      } else {
        maxStreak = Math.max(maxStreak, currentStreak);
        currentStreak = 1;
      }
      previousDate = currentDate;
    });

    maxStreak = Math.max(maxStreak, currentStreak); // Check the final streak
    return maxStreak;
  };

  // Helper function to check if a date is the next day
  const isNextDay = (previousDate, currentDate) => {
    const prev = new Date(previousDate);
    const curr = new Date(currentDate);
    prev.setHours(0, 0, 0, 0); // Normalize the time to 00:00 to avoid comparison issues
    curr.setHours(0, 0, 0, 0); // Normalize the time to 00:00 to avoid comparison issues
    return curr - prev === 86400000; // 24 hours in milliseconds
  };

  // Prepare data for the chart
  const chartData = {
    labels: generatePast7Days(), // Generate the past 7 days dynamically
    datasets: [
      {
        label: "Mood Trends",
        data: generateMoodData(), // Use the generated mood data for each of the 7 days
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.3, // Smooth curves
      },
    ],
  };

  // Function to generate past 7 days' dates
  function generatePast7Days() {
    const dates = [];
    const currentDate = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString());
    }
    return dates;
  }

  // Function to generate mood data for the chart based on the fetched logs
  function generateMoodData() {
    const past7Days = generatePast7Days();
    const moodDataForChart = [];

    // For each day in the last 7 days, we check if there's a corresponding mood log
    past7Days.forEach((day) => {
      const logForDay = moodData.find(
        (log) => new Date(log.date).toLocaleDateString() === day
      );

      if (logForDay) {
        // Map mood to the corresponding number, else use 0 for undefined moods
        moodDataForChart.push(moodMapping[logForDay.mood.toLowerCase()] || 0);
      } else {
        // If no mood log exists for the day, push a default value (e.g., 0)
        moodDataForChart.push(0); // You can change this to a default value like null or 0 depending on your preference
      }
    });

    return moodDataForChart;
  }

  // Graph options with fixed Y-axis
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 14, weight: "bold" },
          autoSkip: true, // Auto-skip to avoid overcrowding labels
        },
      },
      y: {
        min: 0, // Fix the minimum value of Y-axis
        max: 7, // Fix the maximum value of Y-axis
        ticks: {
          font: { size: 14, weight: "bold" },
          callback: (value) => {
            if (value === 0) return ""; 
            return Object.keys(moodMapping).find((key) => moodMapping[key] === value) || value;
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          font: { size: 14, weight: "bold" },
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `Mood: ${Object.keys(moodMapping).find((key) => moodMapping[key] === tooltipItem.raw)}`,
        },
      },
    },
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", padding: "20px" }}>
      <h1 style={{ color: "#2c3e50", fontWeight: "bold" }}>Welcome to the Dashboard!</h1>
      <h2 style={{ color: "#16a085", marginBottom: "20px" }}>How are you feeling today?</h2>

      <textarea
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        placeholder="Describe your mood..."
        rows="3"
        cols="50"
        style={{
          padding: "10px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          width: "60%",
          marginBottom: "10px",
        }}
      ></textarea>
      <br />

      <button
        onClick={handleMoodSubmit}
        style={{
          marginTop: "10px",
          backgroundColor: "#2980b9",
          color: "white",
          border: "none",
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Predict Mood
      </button>

      {prediction && (
        <h3 style={{ marginTop: "20px", fontSize: "20px", fontWeight: "bold" }}>
          Predicted Mood: <span style={{ color: "#e0876a" }}>{prediction}</span>
        </h3>
      )}

      <h2 style={{ marginTop: "40px", color: "#8e44ad" }}>Last 7 Days Mood Analysis</h2>
      <div style={{ width: "80%", height: "400px", margin: "auto", backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "10px" }}>
        {moodData.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <p style={{ fontSize: "18px", color: "#7f8c8d" }}>No mood data available.</p>
        )}
      </div>

      <h3 style={{ marginTop: "30px", color: "#16a085" }}>
        Max Streak of Mood Logs in the Last Week: {maxStreak}
      </h3>
    </div>
  );
};

export default Dashboard;

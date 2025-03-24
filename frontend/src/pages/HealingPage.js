import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api'; // Import API instance from api.js
import { AuthContext } from '../context/AuthContext';

const healingContent = {
  "ADHD": {
    "Normal": { text: "You seem to have no ADHD symptoms.", video: "https://www.youtube.com/embed/UzOlgXaogYk?si=NZnmalQSwtoVGC8p" },
    "Mild": { text: "Try focusing exercises and structured routines.", video: "https://www.youtube.com/embed/Am-XbS0y0hE?si=D8JCWPwW2oegSHGw" },
    "Moderate": { text: "Consider professional help and cognitive therapy.", video: "https://www.youtube.com/embed/2CrZWq7oAJE?si=rYqWNHaNi7QcmFtd" },
    "Moderately Severe": { text: "Structured therapy and medication might help.", video: "https://www.youtube.com/embed/vQRh_VMA7Vc?si=idF807ft_1UZco76" },
    "Severe": { text: "Consult a mental health professional immediately.", video: "https://www.youtube.com/embed/JiwZQNYlGQI?si=Bz6krdz4K3by3l9X" }
  },
  "PTSD": {
    "Normal": { text: "No signs of PTSD detected.", video: "https://www.youtube.com/embed/6tgy4d-pxuY?si=ja1Peukl_6LVI4QN" },
    "Mild": { text: "Practice deep breathing and mindfulness.", video: "https://www.youtube.com/embed/H8cZiIq3yXw?si=zQkED5txb1EBpGaW" },
    "Moderate": { text: "Therapy and journaling can be beneficial.", video: "https://www.youtube.com/embed/b_n9qegR7C4?si=ieaQYNUIgJWKdtZC" },
    "Moderately Severe": { text: "Consider support groups and therapy.", video: "https://www.youtube.com/embed/2IRhanwkZJE?si=g8GTGpuOrUVNtwOR" },
    "Severe": { text: "Seek professional guidance immediately.", video: "https://www.youtube.com/embed/64xr5YYPQSc?si=tdki5LOLWLvemeGw" }
  },
  "GAD-7": {
    "Normal": { text: "No significant anxiety symptoms.", video: "https://www.youtube.com/embed/WWloIAQpMcQ?si=BJLcVA11rLnSNTvc" },
    "Mild": { text: "Try relaxation techniques and journaling.", video: "https://www.youtube.com/embed/oEpOK9fWmmI?si=2iBpvda3deJMeot2" },
    "Moderate": { text: "Professional therapy can help manage symptoms.", video: "https://www.youtube.com/embed/IzFObkVRSV0?si=AEcMMOoz1spRgZPL" },
    "Moderately Severe": { text: "Consider therapy and medication.", video: "https://www.youtube.com/embed/FEXPduL-_c4?si=pk0C91fmtWSr5bM9" },
    "Severe": { text: "Seek immediate medical help.", video: "https://www.youtube.com/embed/AEBJsS7OhZQ?si=EHVebZDVsQpVpkK" }
  },
  "PHQ-9": {
    "Normal": { text: "No signs of depression detected.", video: "https://www.youtube.com/embed/z-IR48Mb3W0?si=ZNQ9G4lI-wFaN3uy" },
    "Mild": { text: "Engage in hobbies and physical activities.", video: "https://www.youtube.com/embed/MZ5r99SBLrs?si=bummztDiacd6UKqO" },
    "Moderate": { text: "Therapy and structured routines can help.", video: "https://www.youtube.com/embed/D0WNARDzjvI?si=w4QyIl1EOFby0ZAU" },
    "Moderately Severe": { text: "Professional help is strongly advised.", video: "https://www.youtube.com/embed/VlDgowUAyx4?si=XTpl7xW-dc78CHnl" },
    "Severe": { text: "Seek immediate medical support.", video: "https://www.youtube.com/embed/2SptlRH4MyY?si=rVa6nH0V39KIX0lU" }
  }
};



const generalHealthTips = [
  "Maintain a balanced diet with plenty of fruits and vegetables.",
  "Exercise regularly to boost your physical and mental health.",
  "Ensure adequate sleep for overall well-being.",
  "Practice mindfulness or meditation to reduce stress."
];


const generalQuiz = {
  question: "How often should you exercise for optimal health?",
  options: ["Daily", "Weekly", "Monthly", "Rarely"],
  correct: "Daily",
  feedback: "Regular daily exercise is beneficial for overall physical and mental well-being."
};


const quizData = {
  "ADHD": {
    "Normal": {
      question: "What is a benefit of having no ADHD symptoms?",
      options: ["Good focus", "Poor attention", "Difficulty concentrating"],
      correct: "Good focus",
      feedback: "Having no ADHD symptoms means you can concentrate well."
    },
    "Mild": {
      question: "Which technique might help with mild ADHD symptoms?",
      options: ["Ignoring tasks", "Structured routines", "Overthinking"],
      correct: "Structured routines",
      feedback: "Structured routines can help manage mild ADHD symptoms."
    },
    "Moderate": {
      question: "What is often recommended for moderate ADHD?",
      options: ["Cognitive therapy", "No help", "Ignore symptoms"],
      correct: "Cognitive therapy",
      feedback: "Cognitive therapy is beneficial for moderate ADHD symptoms."
    },
    "Moderately Severe": {
      question: "Which treatment might be recommended for moderately severe ADHD?",
      options: ["Medication", "Avoidance", "Overexertion"],
      correct: "Medication",
      feedback: "Medication along with therapy can help manage symptoms."
    },
    "Severe": {
      question: "What should you do if you have severe ADHD symptoms?",
      options: ["Consult a professional", "Ignore them", "Self-medicate"],
      correct: "Consult a professional",
      feedback: "It is important to seek professional help immediately."
    }
  },
  "PTSD": {
    "Normal": {
      question: "What is a sign of no PTSD symptoms?",
      options: ["Feeling safe", "Feeling anxious", "Avoiding memories"],
      correct: "Feeling safe",
      feedback: "No PTSD symptoms generally indicate you feel safe."
    },
    "Mild": {
      question: "Which technique can help with mild PTSD?",
      options: ["Deep breathing", "Avoidance", "Substance abuse"],
      correct: "Deep breathing",
      feedback: "Deep breathing helps reduce stress and anxiety."
    },
    "Moderate": {
      question: "What is recommended for moderate PTSD?",
      options: ["Journaling", "Suppressing emotions", "Isolation"],
      correct: "Journaling",
      feedback: "Journaling can help manage emotions in moderate PTSD."
    },
    "Moderately Severe": {
      question: "What is often advised for moderately severe PTSD?",
      options: ["Support groups", "Ignoring symptoms", "Self-isolation"],
      correct: "Support groups",
      feedback: "Joining a support group can be very helpful."
    },
    "Severe": {
      question: "What should you do if you have severe PTSD symptoms?",
      options: ["Seek professional help", "Avoid talking about it", "Use self-medication"],
      correct: "Seek professional help",
      feedback: "Professional guidance is crucial for severe PTSD."
    }
  },
  "GAD-7": {
    "Normal": {
      question: "What is an indicator of normal anxiety levels?",
      options: ["Calmness", "Constant worry", "Avoidance behavior"],
      correct: "Calmness",
      feedback: "Normal anxiety levels often mean you feel generally calm."
    },
    "Mild": {
      question: "What technique helps manage mild anxiety?",
      options: ["Mindfulness", "Overthinking", "Avoiding relaxation"],
      correct: "Mindfulness",
      feedback: "Mindfulness can reduce anxiety symptoms."
    },
    "Moderate": {
      question: "Which approach is beneficial for moderate anxiety?",
      options: ["Professional therapy", "Ignoring feelings", "Suppression"],
      correct: "Professional therapy",
      feedback: "Therapy can help manage moderate anxiety."
    },
    "Moderately Severe": {
      question: "What is recommended for moderately severe anxiety?",
      options: ["Combination therapy", "No treatment", "Self-treatment"],
      correct: "Combination therapy",
      feedback: "A combination of therapy and medication may be needed."
    },
    "Severe": {
      question: "What should you do if you have severe anxiety?",
      options: ["Seek immediate help", "Self-diagnose", "Avoid discussing it"],
      correct: "Seek immediate help",
      feedback: "Severe anxiety requires immediate professional help."
    }
  },
  "PHQ-9": {
    "Normal": {
      question: "What is a sign of no depression?",
      options: ["Engaging in activities", "Social withdrawal", "Persistent sadness"],
      correct: "Engaging in activities",
      feedback: "Not having depression often means you actively engage in life."
    },
    
    "Mild": {
      question: "What can help with mild depression?",
      options: ["Regular exercise", "Isolation", "Ignoring feelings"],
      correct: "Regular exercise",
      feedback: "Exercise helps improve mood and energy levels."
    },
    "Moderate": {
      question: "What is often recommended for moderate depression?",
      options: ["Therapy", "Ignoring problems", "Self-isolation"],
      correct: "Therapy",
      feedback: "Therapy can help manage moderate depression symptoms."
    },
    "Moderately Severe": {
      question: "What treatment is advised for moderately severe depression?",
      options: ["Professional help", "Avoiding social interaction", "Ignoring symptoms"],
      correct: "Professional help",
      feedback: "It is important to get professional support for moderately severe depression."
    },
    "Severe": {
      question: "What is the recommended action for severe depression?",
      options: ["Seek immediate help", "Wait it out", "Self-medicate"],
      correct: "Seek immediate help",
      feedback: "Severe depression requires immediate professional intervention."
    }
  }
};

// Updated normalizeLabel to title-case every word.
const normalizeLabel = (label) => {
  if (!label) return "";
  return label
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// A simple interactive quiz component with unique radio group names.
const InteractiveQuiz = ({ quiz, quizId }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ margin: '10px 0', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
      <p><strong>Quiz:</strong> {quiz.question}</p>
      <form onSubmit={handleSubmit}>
        {quiz.options.map((option, idx) => (
          <div key={idx}>
            <input 
              type="radio" 
              id={`${quizId}-option-${idx}`} 
              name={quizId} 
              value={option} 
              onChange={() => setSelectedOption(option)}
              disabled={submitted}
            />
            <label htmlFor={`${quizId}-option-${idx}`}>{option}</label>
          </div>
        ))}
        {!submitted && <button type="submit" style={{ marginTop: '5px' }}>Submit</button>}
      </form>
      {submitted && (
        <p style={{ color: selectedOption === quiz.correct ? 'green' : 'red' }}>
          {selectedOption === quiz.correct ? "Correct! " : "Incorrect. "}
          {quiz.feedback}
        </p>
      )}
    </div>
  );
};

const HealingPage = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(''); // To track the selected option
  const [submitted, setSubmitted] = useState(false); // To track if the form has been submitted


  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };
  useEffect(() => {
    const fetchTestResults = async () => {
      if (!token) {
        setError('User not authenticated.');
        setLoading(false);
        return;
      }

      try {
        const response = await API.get(`${API_URL}/tests/all-tests`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.data || response.data.length === 0) {
          setError('No test results found.');
        } else {
          setTestResults(response.data);
        }
      } catch (err) {
        console.error('Error fetching test results:', err);
        setError('Error fetching test results.');
      } finally {
        setLoading(false);
      }
    };

    fetchTestResults();
  }, [token]);

  if (loading) return <p>Loading healing content...</p>; 
   if (testResults.length === 0) return <p>No healing content available.Please take a test to unlock healing content.</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;


  return (
    <div style={{ padding: '20px' }}>
      <h2>Healing Section</h2>

      {/* General Health Tips */}
      <h3>General Health Tips</h3>
      <ul>
        {generalHealthTips.map((tip, index) => (
          <li key={index}>{tip}</li>
        ))}
      </ul>

      {/* General Quiz */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h3>{generalQuiz.question}</h3>
        <form onSubmit={handleSubmit}>
          {generalQuiz.options.map((option, idx) => (
            <div key={idx}>
              <input 
                type="radio" 
                id={`general-quiz-option-${idx}`} 
                name="general-quiz" 
                value={option} 
                onChange={() => setSelectedOption(option)} 
                disabled={submitted} 
              />
              <label htmlFor={`general-quiz-option-${idx}`}>{option}</label>
            </div>
          ))}
          {!submitted && <button type="submit" style={{ marginTop: '5px' }}>Submit</button>}
        </form>

        {submitted && (
          <p style={{ color: selectedOption === generalQuiz.correct ? 'green' : 'red' }}>
            {selectedOption === generalQuiz.correct ? "Correct! " : "Incorrect. "}
            {generalQuiz.feedback}
          </p>
        )}
      </div>
      {testResults.map((test, index) => {
        const { testType, label } = test;
        const normalizedLabel = normalizeLabel(label);
        const content = healingContent[testType]?.[normalizedLabel] || { text: "No healing content available.", video: "" };
        const quiz = quizData[testType]?.[normalizedLabel];

        return (
          <div key={index} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>{testType} - {normalizedLabel}</h3>
            <p>{content.text}</p>
            {content.video && content.video.includes('youtu') ? (
              <iframe 
                width="600" 
                height="400" 
                src={content.video} 
                title="Healing Video" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
            ) : content.video ? (
              <video src={`/videos/${content.video}`} controls width="600" />
            ) : null}
            {quiz ? (
              <InteractiveQuiz quiz={quiz} quizId={`${testType}-${normalizedLabel}`} />
            ) : (
              <p>No interactive quiz available for this test label.</p>
            )}
          </div>
        );
      })}
      
      <br />
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};


export default HealingPage;

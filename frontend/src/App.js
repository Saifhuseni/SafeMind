import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage'; // Add HomePage
import Navbar from './components/Layout/Navbar'; // Import Navbar
import TestPage from './pages/TestPage'; // Ensure TestPage is imported
import TestResult from './pages/TestResult';
import HealingPage from './pages/HealingPage';
const App = () => (
  <AuthProvider>
    <Navbar /> {/* Navbar will appear across all pages */}
    <Routes>
      <Route path="/" element={<HomePage />} /> {/* HomePage as the starting page */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
       <Route path="/testresult/:resultId" element={<TestResult />} />
      <Route
        path="/testpage"
        element={
          <PrivateRoute>
            <TestPage />
          </PrivateRoute>
        }
        
      /> 
      
     <Route
        path="/healing"
        element={
          <PrivateRoute>
            <HealingPage /> {/* This page should be created to handle the Healing section */}
          </PrivateRoute>
        }
      />


    </Routes>

    
  </AuthProvider>
);

export default App;

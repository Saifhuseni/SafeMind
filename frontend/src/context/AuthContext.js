import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode correctly
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState({
    token: null,
    user: null,
    userId: null, // Add userId to the state
    isAuthenticated: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setAuthState({
          token,
          user: decoded, // Ensure user data (including username) is extracted
          userId: decoded.userId, // Add userId to the state
          isAuthenticated: true,
        });
        // Redirect to dashboard if logged in and on login/register page
        if (
          window.location.pathname === '/login' ||
          window.location.pathname === '/register'
        ) {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        logout(); // Call logout if token is invalid
      }
    } else {
      // Don't block access to homepage if not logged in
      if (
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/register' &&
        window.location.pathname !== '/'
      ) {
        navigate('/login');
      }
    }
  }, [navigate]);

  const login = (token) => {
    const decoded = jwtDecode(token);
    localStorage.setItem('token', token);
    setAuthState({
      token,
      user: decoded,
      userId: decoded.userId, // Store userId in the state
      isAuthenticated: true,
    });
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({
      token: null,
      user: null,
      userId: null, // Reset userId on logout
      isAuthenticated: false,
    });
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

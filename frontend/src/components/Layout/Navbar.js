import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import '../../css/Navbar.css'; // Importing the CSS file for styling

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        {/* Wrap the logo and title in a Link to navigate to the homepage */}
        <Link to="/" className="navbar-home-link">
          {/* <img src="/path/to/logo.png" alt="Logo" className="logo" /> */}
          <span className="navbar-title">SafeMind</span>
        </Link>
      </div>

      <div className="navbar-links">
        {isAuthenticated ? (
          <ul className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/testpage">Test</Link></li>
            <li><Link to="/healing">Healing</Link></li>
            <li><button onClick={logout} className="logout-button">Logout</button></li>
          </ul>
        ) : (
          <ul className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        )}
      </div>

      <button className="mobile-menu-button" onClick={toggleMobileMenu}>
        &#9776;
      </button>
    </nav>
  );
};

export default Navbar;

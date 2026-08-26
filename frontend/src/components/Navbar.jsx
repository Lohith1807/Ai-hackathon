import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHeartbeat, FaHistory, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import client from '../api/client';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  if (location.pathname === '/login') return null;

  // Simplified auth check for hackathon UI (in real app, use Context/Redux)
  const isAuthenticated = document.cookie.includes('token=');

  const handleLogout = async () => {
    try {
      await client.post('/auth/logout');
      document.cookie = 'token=loggedout; max-age=0'; // clear hint
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="nav-brand">
          <FaHeartbeat /> CareNavigator
        </Link>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {isAuthenticated ? (
            <>
              <Link to="/hospitals" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
                Hospitals
              </Link>
              <Link to="/triage" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
                Triage
              </Link>
              <Link to="/admin" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
                Admin
              </Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
              <FaSignInAlt /> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

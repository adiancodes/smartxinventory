import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  
  // --- DYNAMIC TITLE LOGIC ---
  let title = "Dashboard";
  if (user && user.role === 'ADMIN') {
    title = "Admin Dashboard";
  } else if (user && user.role === 'STORE_MANAGER') {
    title = "Store Manager Dashboard";
  }
  // ---------------------------

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header className="admin-header">
      <div className="header-title">
        <h3>{title}</h3> {/* <-- USE DYNAMIC TITLE */}
      </div>
      <div className="header-user-menu">
        <span>Welcome, {user ? user.username : 'User'}</span>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
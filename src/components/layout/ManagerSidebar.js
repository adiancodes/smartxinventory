import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css'; // We can reuse the same CSS

const ManagerSidebar = () => {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h2>SmartShelfX</h2>
      </div>
      <ul className="sidebar-nav">
        <li>
          {/* --- LINK UPDATED --- */}
          <NavLink to="/manager/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          {/* --- LINK UPDATED --- */}
          <NavLink to="/manager/inventory" className={({ isActive }) => isActive ? 'active' : ''}>
            <span>Inventory</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default ManagerSidebar;
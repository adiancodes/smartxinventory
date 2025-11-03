import React from 'react';
import { NavLink } from 'react-router-dom'; // Use NavLink for active styling
import './Sidebar.css'; 
// You would add icons from a library like 'react-icons' here
// import { MdDashboard, MdInventory } from 'react-icons/md';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        {/*  */}
        <h2>SmartShelfX</h2>
      </div>
      <ul className="sidebar-nav">
        <li>
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
            {/* <MdDashboard /> */}
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/inventory" className={({ isActive }) => isActive ? 'active' : ''}>
            {/* <MdInventory /> */}
            <span>Inventory</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
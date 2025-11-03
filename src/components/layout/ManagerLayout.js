import React from 'react';
import { Outlet } from 'react-router-dom';
import ManagerSidebar from './ManagerSidebar'; // <-- IMPORT MANAGER SIDEBAR
import Header from './Header';
import './AdminLayout.css'; // We can reuse the same CSS

const ManagerLayout = () => {
  return (
    <div className="admin-layout">
      <ManagerSidebar /> {/* <-- USE MANAGER SIDEBAR */}
      <div className="admin-main-content">
        <Header />
        <main className="admin-page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ManagerLayout;
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar'; // <-- UPDATE THIS IMPORT
import Header from './Header';
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar /> {/* <-- AND UPDATE THIS COMPONENT */}
      <div className="admin-main-content">
        <Header />
        <main className="admin-page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authService from '../services/authService';

const AdminRoute = () => {
  const role = authService.getCurrentUserRole();

  // Check if user is logged in AND has the ADMIN role
  if (role === 'ADMIN') {
    return <Outlet />; // User is admin, render the nested component (AdminLayout)
  }
  
  // Not an admin, redirect to login
  return <Navigate to="/login" replace />; 
};

export default AdminRoute;
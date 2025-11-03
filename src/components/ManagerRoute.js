import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authService from '../services/authService';

const ManagerRoute = () => {
  const role = authService.getCurrentUserRole();

  // Check if user is logged in AND has the STORE_MANAGER role
  if (role === 'STORE_MANAGER') {
    return <Outlet />; // User is a manager, render the nested component (ManagerLayout)
  }
  
  // Not a manager, redirect to login
  return <Navigate to="/login" replace />; 
};

export default ManagerRoute;
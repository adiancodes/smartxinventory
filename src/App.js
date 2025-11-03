import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import authService from './services/authService';

// --- Pages ---
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// --- Admin Components ---
import AdminLayout from './components/layout/AdminLayout';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminInventory from './pages/admin/AdminInventory';

// --- Manager Components (NEW) ---
import ManagerLayout from './components/layout/ManagerLayout'; // <-- NEW
import ManagerRoute from './components/ManagerRoute';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ManagerInventory from './pages/manager/ManagerInventory';


import './App.css';

// A component to handle the login redirect logic
const HomeRedirect = () => {
  const role = authService.getCurrentUserRole();
  
  if (role === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  if (role === 'STORE_MANAGER') {
    return <Navigate to="/manager/dashboard" replace />;
  }

  // if (role === 'USER') {
  //   return <Navigate to="/user/dashboard" replace />;
  // }

  // If no role or not logged in
  return <Navigate to="/login" replace />;
};


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Auth Routes --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* --- Protected Admin Routes --- */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
        </Route>

        {/* --- NEW Protected Manager Routes --- */}
        <Route path="/manager" element={<ManagerRoute />}>
          {/* Manager routes use ManagerLayout */}
          <Route element={<ManagerLayout />}> {/* <-- THIS IS THE FIX */}
            <Route path="dashboard" element={<ManagerDashboard />} />
            <Route path="inventory" element={<ManagerInventory />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
        </Route>

        {/* --- Default Route --- */}
        <Route path="/" element={<HomeRedirect />} />

        {/* --- Fallback for unknown routes --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;

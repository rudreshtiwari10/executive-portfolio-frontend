import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';

// Admin Pages
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import DashboardHome from './pages/Admin/DashboardHome';
import ExpertiseManage from './pages/Admin/ExpertiseManage';
import ProtectedRoute from './components/Admin/ProtectedRoute';

// Public Pages (to be built later)
import HomePage from './pages/HomePage';

import './App.css';
import Ankush from './components/Ankush';

function App() {
  return (
    <AdminProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Ankush/>} />

          {/* Admin Login Route (hidden, accessed by typing URL directly) */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            {/* Default redirect to dashboard */}
            <Route index element={<Navigate to="/admin/dashboard" replace />} />

            {/* Dashboard Home */}
            <Route path="dashboard" element={<DashboardHome />} />

            {/* Content Management Routes */}
            <Route path="hero" element={<div style={{padding: '20px'}}>Hero Section Management (Coming Soon)</div>} />
            <Route path="about" element={<div style={{padding: '20px'}}>About Section Management (Coming Soon)</div>} />
            <Route path="expertise" element={<ExpertiseManage />} />
            <Route path="companies" element={<div style={{padding: '20px'}}>Companies Management (Coming Soon)</div>} />
            <Route path="achievements" element={<div style={{padding: '20px'}}>Achievements Management (Coming Soon)</div>} />
            <Route path="sections" element={<div style={{padding: '20px'}}>Custom Sections Management (Coming Soon)</div>} />
            <Route path="profile" element={<div style={{padding: '20px'}}>Profile Settings (Coming Soon)</div>} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AdminProvider>
  );
}

export default App;

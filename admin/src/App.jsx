import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminLayout from './components/AdminLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Users from './pages/Users.jsx';
import Hosts from './pages/Hosts.jsx';
import Listings from './pages/Listings.jsx';
import Bookings from './pages/Bookings.jsx';
import Finance from './pages/Finance.jsx';
import Reviews from './pages/Reviews.jsx';
import MasterData from './pages/MasterData.jsx';
import Roles from './pages/Roles.jsx';
import Support from './pages/Support.jsx';
import Marketing from './pages/Marketing.jsx';
import CMS from './pages/CMS.jsx';
import Reports from './pages/Reports.jsx';
import Settings from './pages/Settings.jsx';
import Security from './pages/Security.jsx';
import Login from './pages/Login.jsx';

export default function App() {
  return (
    <BrowserRouter>
      {/* React Hot Toast Global Provider with Enterprise Airbnb Styling */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1F2937',
            color: '#F9FAFB',
            borderRadius: '10px',
            fontSize: '13.5px',
            fontWeight: '500',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            padding: '12px 16px',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
      <Routes>
        {/* Dedicated Admin Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Portal Layout */}
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="listings" element={<Listings />} />
          <Route path="users" element={<Users />} />
          <Route path="hosts" element={<Hosts />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="finance" element={<Finance />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="master-data" element={<MasterData />} />
          <Route path="roles" element={<Roles />} />
          <Route path="support" element={<Support />} />
          <Route path="marketing" element={<Marketing />} />
          <Route path="cms" element={<CMS />} />
          <Route path="reports" element={<Reports />} />
          <Route path="security" element={<Security />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

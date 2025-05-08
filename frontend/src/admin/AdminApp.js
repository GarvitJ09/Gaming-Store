import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminNavbar from './components/AdminNavbar';
import AdminDashboard from './pages/AdminDashboard';
import OrdersManagement from './pages/OrdersManagement';
import RidersManagement from './pages/RidersManagement';
import AdminLogin from './pages/AdminLogin';
import CreateAdmin from './CreateAdmin';

export default function AdminApp() {
  const { currentUser, isAdmin } = useAuth();

  if (!currentUser) {
    return <AdminLogin />;
  }

  if (!isAdmin) {
    return <Navigate to='/' />;
  }

  return (
    <div>
      <AdminNavbar />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path='/' element={<AdminDashboard />} />
          <Route path='/orders' element={<OrdersManagement />} />
          <Route path='/riders' element={<RidersManagement />} />
          <Route path='/create-admin' element={<CreateAdmin />} />
        </Routes>
      </div>
    </div>
  );
}

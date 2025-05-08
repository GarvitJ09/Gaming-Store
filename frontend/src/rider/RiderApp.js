import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RiderNavbar from './components/RiderNavbar';
import Orders from './pages/Orders'; // Orders page as default
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import ProtectedRoute from '../components/auth/ProtectedRoute';

export default function RiderApp() {
  return (
    <>
      {/* Rider Navbar is always displayed */}
      <RiderNavbar />

      {/* Routes for Rider Dashboard */}
      <Routes>
        <Route path='/signin' element={<SignIn />} />
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <Orders /> {/* Orders page is now the default */}
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

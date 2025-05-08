import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return null; // Optionally, show a loading spinner here
  }

  if (!currentUser) {
    return <Navigate to='/login' />; // Redirect to login if not logged in
  }

  return children;
}

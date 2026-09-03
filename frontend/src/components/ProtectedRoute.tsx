import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ adminOnly = false }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Authenticating..." />;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // adminOnly check removed — all authenticated users have full access
  return <Outlet />;
};
